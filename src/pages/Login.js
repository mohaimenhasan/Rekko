import React from "react";
import axios from 'axios';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import rekkoLogo from '../rekkoLogo.svg';
import '../assets/css/login.css';
import { API_URLs } from "../consts/awsConsts";
import CustomFormContainter from "../components/CustomFormContainter";
import {useGlobalState} from '../context/GlobalState';

const Login = () => {
    const [globalState, setGlobalState] = useGlobalState();
    const navigate = useNavigate();

    const isUserAValidUser = async (childlocalState, childlocalSetState) => {
        try {
            const user  = await Auth.signIn({
                username: childlocalState.email,
                password: childlocalState.password
            });
            console.log('Valid user - ', user);
            childlocalSetState({...childlocalState, errorFound: false});
            return true;
        } catch (error) 
        {
            console.log('error signing in:', error);
            childlocalSetState({...childlocalState, errorFound: true, errorText: error.message});
            return false;
        }
    }

    const logUserIn = async (childlocalState, childlocalSetState) => {
        const validUserCheck = await isUserAValidUser(childlocalState, childlocalSetState);
        if (!validUserCheck){
            return;
        }

        var config = {
            method: 'post',
            url:  `${API_URLs.REKKO_REST_API}/user/createNewUser`,
            headers: { 
              'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                userName: globalState.userName
            })
        };

        await axios(config)
        .then(res => {
            if (res.data.existingUser){
                setGlobalState({
                    ...globalState,
                    userId: res.data._id,
                    existingUser: true
                })
                navigate(`/home/${globalState.userName}`);
            }
            else{
                setGlobalState({
                    ...globalState,
                    userId: res.data._id,
                    existingUser: false
                })
                navigate('/welcome');
            }
        });
    }

    return(
        <div>
            <img src={rekkoLogo} className="App-logo" alt="logo" />
            <header className="login-header">
                <div className="login-title">
                    Welcome back!
                </div>
            </header>
            <div>
                <CustomFormContainter
                    handleFormSubmitAction={logUserIn}
                />
            </div>
        </div>
    );
}

export default Login;