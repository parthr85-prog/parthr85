import { createStackNavigator } from "@react-navigation/stack";
import LabourDashboard from "./LabourDashboard";
import CreateLabourTeamScreen from "./CreateLabourTeamScreen";

const Stack = createStackNavigator();

export default function LabourContractorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={LabourDashboard} />
      <Stack.Screen name="CreateLabourTeam" component={CreateLabourTeamScreen} />
    </Stack.Navigator>
  );
}
