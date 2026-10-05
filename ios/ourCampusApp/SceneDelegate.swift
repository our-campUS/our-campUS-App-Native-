import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else {
      return
    }

    let appDelegate = UIApplication.shared.delegate as? AppDelegate
    let rnDelegate = appDelegate?.reactNativeDelegate ?? ReactNativeDelegate()
    rnDelegate.dependencyProvider = RCTAppDependencyProvider()
    let factory = appDelegate?.reactNativeFactory ?? RCTReactNativeFactory(delegate: rnDelegate)

    reactNativeDelegate = rnDelegate
    reactNativeFactory = factory
    appDelegate?.reactNativeDelegate = rnDelegate
    appDelegate?.reactNativeFactory = factory

    let window = UIWindow(windowScene: windowScene)
    // iOS 13+ scene 라이프사이클에서는 launchOptions를 SceneDelegate가 직접 받지 못한다.
    // 따라서 AppDelegate.didFinishLaunching에서 저장해 둔 값을 사용한다.
    // TODO: 딥링크/푸시로 실행되는 경우는 connectionOptions를 따로 처리해야 함
    factory.startReactNative(
      withModuleName: "ourCampusApp",
      in: window,
      launchOptions: appDelegate?.launchOptions
    )
    self.window = window
    // UIApplication.delegate.window를 참조하는 코드를 위한 호환용
    appDelegate?.window = window
  }
}
