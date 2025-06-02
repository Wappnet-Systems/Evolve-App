package com.evolve;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.os.Build;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;

public class AppUsageModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    public AppUsageModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "AppUsage";
    }

    @ReactMethod
    public void getForegroundApp(Promise promise) {
        try {
            UsageStatsManager usm = (UsageStatsManager) reactContext.getSystemService(Context.USAGE_STATS_SERVICE);
            long time = System.currentTimeMillis();
            List<UsageStats> stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, time - 1000 * 1000, time);

            if (stats != null) {
                SortedMap<Long, UsageStats> sortedStats = new TreeMap<>();
                for (UsageStats usage : stats) {
                    if (usage.getLastTimeUsed() > 0) {
                        sortedStats.put(usage.getLastTimeUsed(), usage);
                    }
                }

                if (!sortedStats.isEmpty()) {
                    String topPackageName = sortedStats.get(sortedStats.lastKey()).getPackageName();
                    promise.resolve(topPackageName);
                } else {
                    promise.reject("EMPTY", "No usage data available");
                }
            } else {
                promise.reject("NULL", "Usage stats is null");
            }

        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
}
