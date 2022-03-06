import {CdkStack} from '../cdk-stack';
import { HealthLambda } from '../lambdas/healthLambda/healthLambda';
import { AuthorizationType, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';

export const UsersRestAPIStack = (parent: CdkStack) => {
    // deploy the lambdas first
    const healthLambda = HealthLambda(parent);
    const restAPI = new RestApi(parent, 'RekkoUsersRestAPI', 
    {
        description: 'Rest API for Rekko User Info',
    });

    restAPI.root.addMethod('ANY');

    const fetchUsers = restAPI.root.addResource('getAllUsers');
    const createUsers = restAPI.root.addResource('checkAndCreateNewUser');

    fetchUsers.addMethod('GET', new LambdaIntegration(healthLambda), {
        operationName: 'getAllUsers',
        authorizationType: AuthorizationType.NONE, // TO DO this would need to change to cognito auth
    });
    
    createUsers.addMethod('GET', new LambdaIntegration(healthLambda), {
        operationName: 'getAllUsers',
        authorizationType: AuthorizationType.NONE, // TO DO this would need to change to cognito auth
    });
}