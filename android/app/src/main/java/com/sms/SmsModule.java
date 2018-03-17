package com.sms;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.annotation.Nullable;
import android.telephony.SmsManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class SmsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    @Override
    public String getName() {
        return "SMS";
    }

    private void sendEvent(String messageId, String status) {
        WritableMap params = Arguments.createMap();
        params.putString("messageId", messageId);
        params.putString("status", status);

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
    public void send(final String messageId, String phoneNumber, String message){

        try {
            String SENT = "SMS_SENT";
            String DELIVERED = "SMS_DELIVERED";

            PendingIntent sentPI = PendingIntent.getBroadcast(reactContext, 0,
                    new Intent(SENT), 0);

            PendingIntent deliveredPI = PendingIntent.getBroadcast(reactContext, 0,
                    new Intent(DELIVERED), 0);

            //---when the SMS has been sent---
            reactContext.registerReceiver(new BroadcastReceiver(){
                @Override
                public void onReceive(Context arg0, Intent arg1) {
                    System.out.println("sent callback");
                    switch (getResultCode())
                    {
                        case Activity.RESULT_OK:
                            sendEvent(messageId, "SMS sent");
                            break;
                        case SmsManager.RESULT_ERROR_GENERIC_FAILURE:
                            sendEvent(messageId, "Generic failure");
                            break;
                        case SmsManager.RESULT_ERROR_NO_SERVICE:
                            sendEvent(messageId, "No service");
                            break;
                        case SmsManager.RESULT_ERROR_NULL_PDU:
                            sendEvent(messageId, "Null PDU");
                            break;
                        case SmsManager.RESULT_ERROR_RADIO_OFF:
                            sendEvent(messageId, "Radio off");
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
                            sendEvent(messageId, "SMS delivered");
                            break;
                        case Activity.RESULT_CANCELED:
                            sendEvent(messageId, "SMS not delivered");
                            break;
                    }
                }
            }, new IntentFilter(DELIVERED));

            SmsManager sms = SmsManager.getDefault();
            sms.sendTextMessage(phoneNumber, null, message, sentPI, deliveredPI);
        } catch (Exception e) {
            sendEvent(messageId, "Unknown error");
            throw e;

        }

    }
}