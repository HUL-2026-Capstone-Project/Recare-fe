import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { File } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import type { DocumentTypeResponse } from '@/api/documentApi';
import { colors } from '@/shared/constants/colors';
import CheckBlueSvg from '@/shared/assets/icons-svg/check-blue.svg';
import { useCaseDocumentStore } from '@/store/caseDocumentStore';
import { ALLOWED_UPLOAD_TYPES, DOC_MESSAGES, MAX_UPLOAD_BYTES, ensureExtension, guessMimeFromName } from '../documentFormat';
import { BtnOutline } from './DocButtons';
import { DocSheet } from './DocSheet';
import { DocSpinner } from './DocSpinner';

const ITEM_HEIGHT = 60;
const ITEM_GAP = 8;
const VISIBLE_ITEMS = 4;

type Picked = { uri: string; name: string; mime: string; size?: number | null };

type Props = {
  caseId: number;
  types: DocumentTypeResponse[];
  onClose: () => void;
  // 시트를 닫은 뒤 토스트로 알릴 결과(시안의 t1~t4는 시트 없이 토스트만 있는 모습이다)
  onToast: (message: string) => void;
};

const fileNameFromUri = (uri: string) => decodeURIComponent(uri.split('?')[0].split('/').pop() ?? '') || '서류';

// 선택한 파일의 크기·형식 값이 비어 있으면 그 검사는 건너뛰고 서버 응답(413/400)에 맡긴다.
export function UploadSheet({ caseId, types, onClose, onToast }: Props) {
  const upload = useCaseDocumentStore((state) => state.upload);
  const [pickedTypeId, setPickedTypeId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const finish = (message: string) => {
    onClose();
    onToast(message);
  };

  const handlePicked = async (picked: Picked) => {
    if (pickedTypeId == null) return;
    if (picked.size && picked.size > MAX_UPLOAD_BYTES) return finish(DOC_MESSAGES.tooLarge);

    const mime = (picked.mime || guessMimeFromName(picked.name) || '').toLowerCase().replace('image/jpg', 'image/jpeg');
    if (picked.mime && !ALLOWED_UPLOAD_TYPES.includes(mime)) return finish(DOC_MESSAGES.badFormat);

    setUploading(true);
    const result = await upload(caseId, pickedTypeId, {
      uri: picked.uri,
      name: mime ? ensureExtension(picked.name, mime) : picked.name,
      type: mime || 'application/octet-stream',
    });
    setUploading(false);
    finish(
      result === 'ok' ? DOC_MESSAGES.uploaded : result === 'size' ? DOC_MESSAGES.tooLarge : result === 'format' ? DOC_MESSAGES.badFormat : DOC_MESSAGES.uploadFailed
    );
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        // iOS에서 HEIC를 JPEG로 변환해 받는다.
        preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
      });
      if (result.canceled || result.assets.length === 0) return;
      const asset = result.assets[0];
      await handlePicked({ uri: asset.uri, name: asset.fileName ?? fileNameFromUri(asset.uri), mime: asset.mimeType ?? '', size: asset.fileSize });
    } catch {
      finish(DOC_MESSAGES.uploadFailed);
    }
  };

  const pickFromFiles = async () => {
    try {
      const result = await File.pickFileAsync({ mimeTypes: ALLOWED_UPLOAD_TYPES });
      if (result.canceled) return;
      const file = result.result;
      await handlePicked({ uri: file.uri, name: file.name, mime: file.type, size: file.size });
    } catch {
      finish(DOC_MESSAGES.uploadFailed);
    }
  };

  const list = (
    <View style={{ gap: ITEM_GAP, opacity: uploading ? 0.5 : 1 }}>
      {types.map((type) => {
        const on = pickedTypeId === type.id;
        return (
          <Pressable
            key={type.id}
            disabled={uploading}
            onPress={() => setPickedTypeId(type.id)}
            className="flex-row items-center"
            style={{
              minHeight: ITEM_HEIGHT,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 12,
              gap: 12,
              backgroundColor: on ? colors.primaryLight : '#fff',
              borderWidth: 1.5,
              borderColor: on ? colors.primary : colors.border,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: on ? '700' : '600', color: on ? colors.primary : colors.text1, letterSpacing: -0.3 }}>{type.name}</Text>
              {!!type.simpleDescription && (
                <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text2, marginTop: 2, letterSpacing: -0.2 }}>{type.simpleDescription}</Text>
              )}
            </View>
            {on && <CheckBlueSvg width={20} height={20} />}
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <DocSheet title="서류 추가" lock={uploading} onClose={onClose}>
      <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text2, letterSpacing: -0.3, marginBottom: 14 }}>올릴 서류의 종류를 먼저 골라 주세요</Text>
      {types.length > VISIBLE_ITEMS ? (
        <ScrollView style={{ maxHeight: VISIBLE_ITEMS * ITEM_HEIGHT + (VISIBLE_ITEMS - 1) * ITEM_GAP }} showsVerticalScrollIndicator={false}>
          {list}
        </ScrollView>
      ) : (
        list
      )}
      {uploading ? (
        <View className="flex-row items-center justify-center" style={{ height: 52, marginTop: 20, gap: 10 }}>
          <DocSpinner color={colors.primary} size={18} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text2, letterSpacing: -0.3 }}>올리는 중이에요</Text>
        </View>
      ) : (
        <View className="flex-row" style={{ gap: 8, marginTop: 20 }}>
          <BtnOutline off={pickedTypeId == null} onPress={pickFromGallery}>
            사진첩에서 선택
          </BtnOutline>
          <BtnOutline off={pickedTypeId == null} onPress={pickFromFiles}>
            파일에서 선택
          </BtnOutline>
        </View>
      )}
    </DocSheet>
  );
}
