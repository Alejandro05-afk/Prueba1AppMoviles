import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export const uploadImage = async (uri: string): Promise<string> => {
  try {
    const ext = uri.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `${fileName}`;

    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });

    const { data, error } = await supabase.storage
      .from('dish-images')
      .upload(filePath, decode(base64), {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      });

    if (error) {
      throw error;
    }

    const { data: publicData } = supabase.storage
      .from('dish-images')
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (error) {
    console.error('Error uploading image: ', error);
    throw error;
  }
};
