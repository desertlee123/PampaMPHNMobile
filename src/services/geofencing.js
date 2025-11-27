import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

export async function startGeofencingAsync() {

  // console.log("preparando geofencing");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  // console.log("fin notifcacion preparando geofencing");

  // Localizacion apra verificar cuando el usuario entra y sale del museo
  TaskManager.defineTask('GEOFENCING_TASK', ({ data: { eventType, region }, error }) => {
    if (error) {
      console.error("error al inicar la tarea de geofencing: ", error);
      return;
    }
    if (eventType === Location.GeofencingEventType.Enter) {
      console.log("notificacion de entrada");
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Bienvenida',
          body: "Bienbenido!! 😀 llegaste al museo 👏👏👏, Espero que disfutes de todo lo que tenes para ofrecer",
        },
        trigger: null,
      });
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log("notificacion de salida");
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Organizando proxima visita',
          body: "Esperamos que lo allas pasado increible 😀, te estaremos esperando 👋",
        },
        trigger: null,
      });
    }
  });

  console.log("fin task preparando geofencing");

  const regions = [
    {
      identifier: 'Museo',
      latitude: -35.663976,
      longitude: -63.769680,
      radius: 50, // metros
    },
  ];

  // console.log("inicio permisos de location preparando geofencing");
  var { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    setErrorMsg('Permission to access location was denied in foreground');
    return;
  }else{
    console.log("permisos dados de foregroud");
  }
  var { status } = await Location.requestBackgroundPermissionsAsync();
  if (status !== 'granted') {
    setErrorMsg('Permission to access location was denied in backgroud');
    return;
  }else{
    console.log("permisos dados de backgroud");
  }
  // console.log("fin permisos de location preparando geofencing");

  await Location.startGeofencingAsync('GEOFENCING_TASK', regions);

  // console.log("geofencing activado");

  // const tasks = await TaskManager.getRegisteredTasksAsync();
  // console.log(tasks);

  // let loc = await Location.getCurrentPositionAsync({});
  // console.log("Mi ubicación actual:", loc.coords);
}