import { useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import type { ShouldStartLoadRequest, WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes';

import { colors } from '@/shared/constants/colors';
import { Card } from '@/features/home/components/Card';

// 카카오(다음) 우편번호 서비스 스크립트 주소. 바꿔야 할 때 여기만 고친다.
const POSTCODE_SCRIPT_URL = 'https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
// 최상위 이동을 허용하는 호스트(이 도메인과 그 하위 도메인)
const ALLOWED_HOST_SUFFIXES = ['kakao.com', 'kakaocdn.net', 'daum.net', 'daumcdn.net'];

// WebView에 넣는 HTML은 고정 문자열이다(토큰·사용자 정보·기존 주소를 끼워 넣지 않는다).
const POSTCODE_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>html,body{margin:0;padding:0;height:100%;background:#fff}#wrap{width:100%;height:100%}</style>
<script>function post(m){window.ReactNativeWebView.postMessage(JSON.stringify(m));}</script>
</head>
<body>
<div id="wrap"></div>
<script src="${POSTCODE_SCRIPT_URL}" onerror="post({type:'error'})"></script>
<script>
(function () {
  if (!window.daum || !window.daum.Postcode) { post({ type: 'error' }); return; }
  new daum.Postcode({
    oncomplete: function (data) {
      post({
        type: 'address',
        roadAddress: data.roadAddress,
        jibunAddress: data.jibunAddress,
        address: data.address,
        userSelectedType: data.userSelectedType
      });
    },
    width: '100%',
    height: '100%'
  }).embed(document.getElementById('wrap'));
  post({ type: 'ready' });
})();
</script>
</body>
</html>`;

function isAllowedTopLevelUrl(url: string): boolean {
  if (url === 'about:blank' || url.startsWith('data:')) return true;
  const match = /^https:\/\/([^/?#:]+)/i.exec(url);
  if (!match) return false;
  const host = match[1].toLowerCase();
  return ALLOWED_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
}

type Props = {
  visible: boolean;
  onClose: () => void;
  // 선택한 도로명주소. 호출한 화면의 로컬 state에만 담고, 이 컴포넌트는 어디에도 저장하거나 기록하지 않는다.
  onSelect: (address: string) => void;
};

// 가입 2단계와 프로필 수정이 같이 쓰는 주소 검색 전체 화면 모달. 닫히면 WebView가 언마운트되어 다음에 열 때 새로 로드된다.
export function AddressSearchModal({ visible, onClose, onSelect }: Props) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      {visible && <AddressSearchBody onClose={onClose} onSelect={onSelect} />}
    </Modal>
  );
}

function AddressSearchBody({ onClose, onSelect }: Omit<Props, 'visible'>) {
  const { top } = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const fail = () => {
    setFailed(true);
    setLoading(false);
  };

  const retry = () => {
    setFailed(false);
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  // 받은 메시지는 형식이 맞는 것만 처리하고 그 외는 조용히 무시한다(내용을 기록하지 않는다).
  const handleMessage = (event: WebViewMessageEvent) => {
    let message: unknown;
    try {
      message = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }
    if (!message || typeof message !== 'object') return;
    const { type, roadAddress, address } = message as { type?: unknown; roadAddress?: unknown; address?: unknown };

    if (type === 'ready') {
      setLoading(false);
    } else if (type === 'error') {
      fail();
    } else if (type === 'address') {
      const road = typeof roadAddress === 'string' ? roadAddress.trim() : '';
      const fallback = typeof address === 'string' ? address.trim() : '';
      // 프로필 수정의 splitAddress가 마지막 ", " 기준으로 나누므로, 주소 안의 ", "는 ","로 바꿔 둔다.
      const picked = (road || fallback).replace(/, /g, ',');
      if (!picked) return;
      onSelect(picked);
      onClose();
    }
  };

  // 최상위 이동은 카카오/다음 도메인(https)과 about:blank/data:만 허용한다. 하위 프레임은 막지 않는다.
  const handleShouldStartLoad = (request: ShouldStartLoadRequest) => {
    if (!request.isTopFrame) return true;
    return isAllowedTopLevelUrl(request.url);
  };

  return (
    <View className="flex-1 bg-white">
      {/* CaseDetailHeader와 같은 모양(높이 52, 제목 17/700, chevron-left 24, 하단 경계선). 닫기 동작이 달라 직접 그린다. */}
      <View style={{ paddingTop: top, backgroundColor: colors.surface }}>
        <View
          className="h-[52px] px-3 flex-row items-center justify-between"
          style={{ backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}
        >
          <TouchableOpacity className="w-10 items-center justify-center" activeOpacity={0.7} onPress={onClose}>
            <Image source={require('@/shared/assets/icons/chevron-left.png')} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
          <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
            주소 검색
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <View className="flex-1">
        {failed ? (
          <View className="flex-1 justify-center px-5">
            <Card style={{ borderRadius: 16, padding: 0 }}>
              <View className="items-center" style={{ paddingTop: 20, paddingBottom: 8, paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text3, letterSpacing: -0.3, marginTop: 4 }}>불러오지 못했어요</Text>
                <Pressable onPress={retry} className="items-center justify-center" style={{ height: 44, paddingHorizontal: 16 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>다시 시도</Text>
                </Pressable>
              </View>
            </Card>
          </View>
        ) : (
          <>
            <WebView
              key={reloadKey}
              source={{ html: POSTCODE_HTML, baseUrl: 'https://postcode.map.daum.net' }}
              style={{ flex: 1, backgroundColor: colors.surface }}
              javaScriptEnabled
              incognito
              cacheEnabled={false}
              allowFileAccess={false}
              allowFileAccessFromFileURLs={false}
              allowUniversalAccessFromFileURLs={false}
              setSupportMultipleWindows={false}
              mixedContentMode="never"
              onMessage={handleMessage}
              onShouldStartLoadWithRequest={handleShouldStartLoad}
              onError={fail}
              onHttpError={fail}
            />
            {loading && (
              <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
                <ActivityIndicator color={colors.primary} />
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}
