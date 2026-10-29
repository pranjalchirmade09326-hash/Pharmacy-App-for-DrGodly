import { Platform } from 'react-native';

/**
 * Android Emulator (AVD / Virtual Device) Networking:
 * - 10.0.2.2 is the special alias to the host machine's 127.0.0.1 loopback interface.
 * - On a real Android device connected via Wi-Fi, it connects to your PC's LAN IP (10.107.196.132).
 * - On Web or iOS Simulator, localhost:8000 is used directly.
 */

export const DEV_LAN_IP = process.env.EXPO_PUBLIC_API_LAN_URL || 'http://10.107.196.132:8000';
export const EMULATOR_IP = process.env.EXPO_PUBLIC_API_EMULATOR_URL || 'http://10.0.2.2:8000';
export const LOCALHOST_IP = 'http://localhost:8000';

/**
 * Returns the correct backend API URL based on runtime environment.
 * @param useRealDevice Set to true if running on a physical phone over Wi-Fi
 */
export function getApiBaseUrl(useRealDevice: boolean = false): string {
  if (Platform.OS === 'android') {
    return useRealDevice ? DEV_LAN_IP : EMULATOR_IP;
  }
  return LOCALHOST_IP;
}

export const API_BASE_URL = getApiBaseUrl(false);
