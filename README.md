# Go Back To Sleep

A private, calm routine companion for web, Android, and iOS. It presents meditation, chanting, teaching, and music resources; tracks gentle daily rituals; asks for a morning rest score; and saves timestamped gratitude reflections on the device.

## Deliverables

- Web application: publishable static `dist/` folder.
- Android: debug APK at `android/app/build/outputs/apk/debug/app-debug.apk` after `npm run android:apk`.
- iOS: native Xcode project at `ios/App/App.xcworkspace` after `npm run ios:sync`.
- Architecture diagrams: `docs/architecture.puml`, `docs/data-flow.puml`, and generated PNGs when PlantUML is available.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run android:apk
npm run ios:sync
```

Android requires Java 21 and Android SDK platform 35+. iOS compilation requires the full Xcode application and an Apple signing account. An iPhone app cannot be installed by simply sending an unsigned `.ipa` through WhatsApp or email; TestFlight, MDM, or an ad-hoc provisioning profile is required.

## Privacy and playback

Task completion, morning scores, and journal reflections are stored in the device browser/app local storage and are not sent to a server. Videos play in an in-app looping YouTube embed when YouTube permits embedding; the `Open` control uses the regular YouTube page as a reliable fallback.
