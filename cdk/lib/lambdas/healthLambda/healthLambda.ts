import {Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import {CdkStack} from '../../cdk-stack';

export const HealthLambda = (parent: CdkStack) : Function => {
    return new Function(parent, 'HealthFunction', {
        runtime: Runtime.NODEJS_14_X,
        handler: 'restIndex.healthHandler',
        code: Code.fromAsset('src'),
    });
}