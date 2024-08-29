// src/utils/translate.js
import axios from 'axios';
import Constants from 'expo-constants';

const TRANSLATE_API_KEY = Constants.expoConfig.extra.TRANSLATE_API_KEY;
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

export const translateMessage = async (text, targetLanguage) => {
  try {
    const response = await axios.post(TRANSLATE_API_URL, null, {
      params: {
        q: text,
        target: targetLanguage,
        key: TRANSLATE_API_KEY,
      },
    });
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error.response ? error.response.data : error.message);
    return null;
  }
};
