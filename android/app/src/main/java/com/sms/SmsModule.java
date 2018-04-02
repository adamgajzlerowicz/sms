package com.sms;

import android.app.Activity;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;
import android.telephony.SmsManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Random;

public class SmsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    @Override
    public String getName() {
        return "SMS";
    }

    private void sendEvent(String messageId, String status, String type, String color) {
        WritableMap params = Arguments.createMap();
        params.putString("id", messageId);
        params.putString("status", status);
        params.putString("type", type);
        params.putString("color", color);

        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("info", params);
    }


    SmsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    private final String BLUE = "#98AFC7";
    private final String RED = "#E55451";
    private final String GREEN = "#89C35C";

    //---sends an SMS message to another device---
    @ReactMethod
    public void send(final String messageId,
                     String phoneNumber,
                     String message,
                     final String type
    ) {

        try {
            String SENT = "SMS_SENT" + messageId;
            String DELIVERED = "SMS_DELIVERED" + messageId;


            Random generator = new Random();

            final Intent sentIntent = new Intent(SENT);
            sentIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            final PendingIntent sentPI = PendingIntent.getBroadcast(reactContext, generator.nextInt(),
                    sentIntent, PendingIntent.FLAG_CANCEL_CURRENT);

            Intent deliveryIntent = new Intent(DELIVERED);
            PendingIntent deliveredPI = PendingIntent.getBroadcast(reactContext, generator.nextInt(),
                    deliveryIntent, 0);


            //---when the SMS has been sent---
            reactContext.registerReceiver(new BroadcastReceiver() {
                @Override
                public void onReceive(Context arg0, Intent arg1) {



                    reactContext.unregisterReceiver(this);
                    switch (getResultCode()) {
                        case Activity.RESULT_OK:
                            sendEvent(messageId, "Wyslano", type, BLUE);
                            break;
                        case SmsManager.RESULT_ERROR_GENERIC_FAILURE:
                            sendEvent(messageId, "Blad ogolny", type, RED);
                            break;
                        case SmsManager.RESULT_ERROR_NO_SERVICE:
                            sendEvent(messageId, "Brak polaczenia z siecia", type, RED);
                            break;
                        case SmsManager.RESULT_ERROR_NULL_PDU:
                            sendEvent(messageId, "Brak PDU", type, RED);
                            break;
                        case SmsManager.RESULT_ERROR_RADIO_OFF:
                            sendEvent(messageId, "Brak sygnalu", type, RED);
                            break;
                    }

                }
            }, new IntentFilter(SENT));

            //---when the SMS has been delivered---
            reactContext.registerReceiver(new BroadcastReceiver() {
                @Override
                public void onReceive(Context arg0, Intent arg1) {
                    reactContext.unregisterReceiver(this);
                    switch (getResultCode()) {
                        case Activity.RESULT_OK:
                            //Define Notification Manager
                            NotificationManager notificationManager = (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);

                            //Define sound URI
                            Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

                            NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(getReactApplicationContext())
                                    .setContentTitle("foo")
                                    .setContentText("bar")
                                    .setSound(soundUri); //This sets the sound to play

                            //Display notification
                            notificationManager.notify(0, mBuilder.build());

                            sendEvent(messageId, "Dostarczono", type, GREEN);
                            break;
                        case Activity.RESULT_CANCELED:
                            sendEvent(messageId, "Nie dostarczono", type, RED);
                            break;
                    }


                }
            }, new IntentFilter(DELIVERED));

            SmsManager sms = SmsManager.getDefault();
            sms.sendTextMessage(phoneNumber, null, message, sentPI, deliveredPI);
        } catch (Exception e) {
            sendEvent(messageId, "Nieznany blad - to niedobrze!", type, RED);
            throw e;
        }

    }
}