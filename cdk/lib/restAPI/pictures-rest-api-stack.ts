import {CdkStack} from '../cdk-stack';
import { PicturesS3Stack } from '../s3Bucket/pictures-s3-stack';
import { S3FilesLambda } from '../lambdas/S3FilesLambda/S3FilesLambda';
import { AuthorizationType, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';

export const PictureRestStack = async (parent: CdkStack) => {
    const picturesS3Stack = PicturesS3Stack(parent);
    const getObjectLambda = S3FilesLambda(parent, 'getObject', picturesS3Stack.bucketName);
    const putObjectLambda = S3FilesLambda(parent, 'putObject', picturesS3Stack.bucketName);
    const restAPI = new RestApi(parent, 'RekkoPicturesRestAPI', 
    {
        description: 'Rest API for Rekko Users to upload pictures',
    });

    restAPI.root.addMethod('ANY');

    const getPictureURL = restAPI.root.addResource('getPictureURL');
    const uploadPictureURL = restAPI.root.addResource('uploadPictureURL');

    getPictureURL.addMethod('POST', new LambdaIntegration(getObjectLambda), {
        operationName: 'getPictureURL',
        authorizationType: AuthorizationType.NONE, // TO DO this would need to change to cognito auth
    });
    
    uploadPictureURL.addMethod('POST', new LambdaIntegration(putObjectLambda), {
        operationName: 'uploadPictureURL',
        authorizationType: AuthorizationType.NONE, // TO DO this would need to change to cognito auth
    });
}