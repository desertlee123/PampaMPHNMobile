// import Icon from 'react-native-vector-icons/MaterialIcons';
import { lightTheme } from './src/theme/colors';

import { MaterialIcons } from '@expo/vector-icons';

const ICON_SIZE = 24;

export const homeIcons = ({ color }) => <MaterialIcons name="home" size={ICON_SIZE} color={color} />;
export const galeriaIcons = ({ color }) => <MaterialIcons name="photo-library" size={ICON_SIZE} color={color} />;
export const shortsIcons = ({ color }) => <MaterialIcons name="movie" size={ICON_SIZE} color={color} />;
export const buscarIcons = ({ color }) => <MaterialIcons name="search" size={ICON_SIZE} color={color} />;
export const escanearQRIcons = ({ color }) => <MaterialIcons name="qr-code-scanner" size={ICON_SIZE} color={color} />;
export const notificacionesIcons = ({ color }) => <MaterialIcons name="notifications" size={ICON_SIZE} color={color} />;
export const suscripcionIcons = ({ color }) => <MaterialIcons name="subscriptions" size={ICON_SIZE} color={color} />;
export const shareIcon = ({ color }) => <MaterialIcons name="share" size={ICON_SIZE} color={color} />;
export const saveIcon = ({ color }) => <MaterialIcons name="bookmark-border" size={ICON_SIZE} color={color} />;
export const saveAddedIcon = ({ color }) => <MaterialIcons name="bookmark-added" size={ICON_SIZE} color={color} />;
export const closeIcon = ({ color }) => <MaterialIcons name="close" size={ICON_SIZE} color={color} />;
export const messageIcon = ({ color }) => <MaterialIcons name="message" size={ICON_SIZE} color={color} />;