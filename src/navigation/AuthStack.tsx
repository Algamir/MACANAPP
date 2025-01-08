import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";
import ResetPassword from "../screens/auth/ResetPassword";

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
      <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
    </AuthStack.Navigator>
  );
};

export default Auth;
