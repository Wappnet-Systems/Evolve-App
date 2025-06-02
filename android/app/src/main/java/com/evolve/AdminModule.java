package com.evolve;

import android.app.Activity;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AdminModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    public AdminModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "AdminModule";
    }

    @ReactMethod
    public void activateAdmin() {
        Activity currentActivity = getCurrentActivity();
        ComponentName compName = new ComponentName(reactContext, MyDeviceAdminReceiver.class);
        Intent intent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
        intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, compName);
        intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Enable admin to control app usage.");
        currentActivity.startActivityForResult(intent, 1);
    }
}
