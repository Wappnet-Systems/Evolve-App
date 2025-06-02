package com.evolve;
import com.facebook.react.bridge.ReadableMap;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import java.util.Map;
import java.util.HashMap;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;

public class UsageStatsModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public UsageStatsModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "UsageStatsModule";
    }

    @ReactMethod
    public void getUsageStats(ReadableMap config, com.facebook.react.bridge.Callback callback) {
        UsageStatsManager usm = (UsageStatsManager) reactContext.getSystemService(Context.USAGE_STATS_SERVICE);
        long currentTime = System.currentTimeMillis();
        long startTime = currentTime - (1000 * 60 * 60 * 24); // last 24 hours

        List<UsageStats> appList = usm.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                currentTime
        );

        WritableArray result = Arguments.createArray();

        if (appList != null && !appList.isEmpty()) {
            for (UsageStats usageStats : appList) {
                long totalTimeMs = usageStats.getTotalTimeInForeground();
                   if (totalTimeMs > 0) {
                WritableMap app = Arguments.createMap();
                long totalSeconds = totalTimeMs / 1000;

                long hours = totalSeconds / 3600;
                long minutes = (totalSeconds % 3600) / 60;
                long seconds = totalSeconds % 60;

                app.putString("packageName", usageStats.getPackageName());
                app.putInt("hours", (int) hours);
                app.putInt("minutes", (int) minutes);
                app.putInt("seconds", (int) seconds);
                app.putDouble("rawInSeconds", totalSeconds);

                result.pushMap(app);
            }
            }
        }

        callback.invoke(null, result);
    }

//    @ReactMethod
// public void getUsageStats(ReadableMap config, Callback callback) {
//     UsageStatsManager usm = (UsageStatsManager) reactContext.getSystemService(Context.USAGE_STATS_SERVICE);

//     // Get start of the current day (midnight)
//     java.util.Calendar calendar = java.util.Calendar.getInstance();
//     calendar.set(java.util.Calendar.HOUR_OF_DAY, 0);
//     calendar.set(java.util.Calendar.MINUTE, 0);
//     calendar.set(java.util.Calendar.SECOND, 0);
//     calendar.set(java.util.Calendar.MILLISECOND, 0);
//     long startTime = calendar.getTimeInMillis();

//     long endTime = System.currentTimeMillis();

//     List<UsageStats> appList = usm.queryUsageStats(
//             UsageStatsManager.INTERVAL_DAILY,
//             startTime,
//             endTime
//     );

//     WritableArray result = Arguments.createArray();
//     Map<String, Long> usageMap = new HashMap<>();

//     if (appList != null && !appList.isEmpty()) {
//         for (UsageStats usageStats : appList) {
//             long totalTimeMs = usageStats.getTotalTimeInForeground();
//             if (totalTimeMs > 0) {
//                 String packageName = usageStats.getPackageName();
//                 usageMap.put(packageName, usageMap.getOrDefault(packageName, 0L) + totalTimeMs);
//             }
//         }

//         for (Map.Entry<String, Long> entry : usageMap.entrySet()) {
//             long totalSeconds = entry.getValue() / 1000;
//             long hours = totalSeconds / 3600;
//             long minutes = (totalSeconds % 3600) / 60;
//             long seconds = totalSeconds % 60;

//             WritableMap app = Arguments.createMap();
//             app.putString("packageName", entry.getKey());
//             app.putInt("hours", (int) hours);
//             app.putInt("minutes", (int) minutes);
//             app.putInt("seconds", (int) seconds);
//             app.putDouble("rawInSeconds", totalSeconds);

//             result.pushMap(app);
//         }
//     }

//     callback.invoke(null, result);
// }

}
