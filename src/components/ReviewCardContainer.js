import React from 'react';
import {useGlobalState} from '../context/GlobalState';

const ReviewCardContainer = (props) => {
    const [state] = useGlobalState();

    return(
        <div>
            {state.allReviewCards}
        </div>
    )
}

export default ReviewCardContainer;