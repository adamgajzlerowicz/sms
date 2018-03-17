package com.sms;

import android.support.annotation.Nullable;

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

    private void sendEvent( String eventName, @Nullable WritableMap params) {
        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }


    @ReactMethod
    public void show(String message) {


        WritableMap params = Arguments.createMap();
        params.putInt("foo", 2);
        sendEvent("info", params);



        WritableMap params2 = Arguments.createMap();
        params2.putInt("foo", 3);
        sendEvent("info", params2);



    }

    SmsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }
}