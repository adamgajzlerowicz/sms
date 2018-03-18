package com.sms;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
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

    private void sendEvent(String messageId, String status, String type) {
        WritableMap params = Arguments.createMap();
        params.putString("id", messageId);
        params.putString("status", status);
        params.putString("type", type);

        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("info", params);
    }



    SmsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    //---sends an SMS message to another device---
    @ReactMethod
    public void send(final String messageId,
                     String phoneNumber,
                     String message,
                     final String type
    ){

        try {
            String SENT = "SMS_SENT" + messageId;
            String DELIVERED = "SMS_DELIVERED" + messageId;

            Random generator = new Random();

            final Intent sentIntent = new Intent(SENT);
            sentIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            final PendingIntent sentPI = PendingIntent.getBroadcast(reactContext, generator.nextInt(),
                    sentIntent, PendingIntent.FLAG_CANCEL_CURRENT);

            Intent deliveryIntent = new Intent(DELIVERED);
            PendingIntent deliveredPI = PendingIntent.getBroadcast(reactContext, generator.nextInt() ,
                    deliveryIntent, 0);


            //---when the SMS has been sent---
            reactContext.registerReceiver(new BroadcastReceiver(){
                @Override
                public void onReceive(Context arg0, Intent arg1) {
                    switch (getResultCode())
                    {
                        case Activity.RESULT_OK:
                            sendEvent(messageId, "SMS sent", type);
                            break;
                        case SmsManager.RESULT_ERROR_GENERIC_FAILURE:
                            sendEvent(messageId, "Generic failure", type);
                            break;
                        case SmsManager.RESULT_ERROR_NO_SERVICE:
                            sendEvent(messageId, "No service", type);
                            break;
                        case SmsManager.RESULT_ERROR_NULL_PDU:
                            sendEvent(messageId, "Null PDU", type);
                            break;
                        case SmsManager.RESULT_ERROR_RADIO_OFF:
                            sendEvent(messageId, "Radio off", type);
                            break;
                    }

                }
            }, new IntentFilter(SENT));

            //---when the SMS has been delivered---
            reactContext.registerReceiver(new BroadcastReceiver(){
                @Override
                public void onReceive(Context arg0, Intent arg1) {
                    switch (getResultCode())
                    {
                        case Activity.RESULT_OK:
                            sendEvent(messageId, "SMS delivered", type);
                            break;
                        case Activity.RESULT_CANCELED:
                            sendEvent(messageId, "SMS not delivered", type);
                            break;
                    }
                    reactContext.unregisterReceiver(this);
                }
            }, new IntentFilter(DELIVERED));

            SmsManager sms = SmsManager.getDefault();
            sms.sendTextMessage(phoneNumber, null, message, sentPI, deliveredPI);
        } catch (Exception e) {
            sendEvent(messageId, "Unknown error", type);
            throw e;

        }

    }
}