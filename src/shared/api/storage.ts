import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from './supabase';

const MAX_RETRIES = 3;
const BASE_DELAY = 500; // ms

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const uploadImage = async (uri: string): Promise<string> => {
  const ext = uri.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}.${ext}`;
  const filePath = `${fileName}`;

  let lastError: any;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`[Upload] Attempt ${attempt + 1}/${MAX_RETRIES} for ${fileName}`);

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

      console.log(`[Upload] Success on attempt ${attempt + 1}`);
      return publicData.publicUrl;
    } catch (error) {
      lastError = error;
      console.error(`[Upload] Attempt ${attempt + 1} failed:`, error);

      // Si no es el último intento, espera antes de reintentar
      if (attempt < MAX_RETRIES - 1) {
        const waitTime = BASE_DELAY * Math.pow(2, attempt); // 500ms, 1s, 2s
        console.log(`[Upload] Waiting ${waitTime}ms before retry...`);
        await delay(waitTime);
      }
    }
  }

  // Si llegamos aquí, todos los intentos fallaron
  console.error(`[Upload] Failed after ${MAX_RETRIES} attempts`);
  throw lastError;
};
