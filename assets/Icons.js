import Icon from 'react-native-vector-icons/MaterialIcons';
import { lightTheme } from './src/theme/colors';

const ICON_SIZE = 24;

export const homeIcons = ({color}) => <Icon name="home" size={ICON_SIZE} color={color} />;
export const galeriaIcons = ({color}) => <Icon name="photo-library" size={ICON_SIZE} color={color} />;
export const shortsIcons = ({color}) => <Icon name="movie" size={ICON_SIZE} color={color} />;
export const buscarIcons = ({color}) => <Icon name="search" size={ICON_SIZE} color={color} />;
export const escanearQRIcons = ({color}) => <Icon name="qr-code-scanner" size={ICON_SIZE} color={color} />;
export const notificacionesIcons = ({color}) => <Icon name="notifications" size={ICON_SIZE} color={color} />;
export const suscripcionIcons = ({color}) => <Icon name="subscriptions" size={ICON_SIZE} color={color} />;
