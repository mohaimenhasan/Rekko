import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import LoginFormStyler from '../utils/LoginFormStyler';
import axios from 'axios';
import {useGlobalState} from '../context/GlobalState';
import ReviewCard from './ReviewCard';

const CustomSearchBar = (props) => {
  const [globalState, globalSetState] = useGlobalState();
  const [state, setState] = useState({ searchVal: ''});
  const {classes} = props;
  let currentReviews = globalState.allReviewCards;

  const refreshAllReviews = async (event) => {
    await axios.get(`${window.location.origin.toString()}/review/getAllReviews`, {})
      .then(res => {
          let allReviews = [];
          res.data.data.forEach(x => allReviews.push(
              <ReviewCard
                  key={x['_id']}
                  heading={`${x['User']['UserLogin']}, ${(new Date(x['ReviwedAt'])).toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric'})} at ${(new Date(x['ReviwedAt'])).toLocaleString('default', { timeStyle: 'long'})}`} 
                  brandName={x['Product']['ProductBrand']} 
                  productName={x['Product']['ProductName']} 
                  review={x['ReviewText']}
              />));
          currentReviews = allReviews;
          globalSetState({...globalState, allReviewCards: allReviews});
      })
      .catch(error => {
          console.log(`Error fetching all the reviews while mounting the home page with error: ${error}`);
      })
  }

  const handleSubmit = async (event) => {
    if (state.searchVal === ''){
      await refreshAllReviews();
      return;
    }
    await axios.get(`${window.location.origin.toString()}/review/searchThroughEntireReview`, {
      params: {
        reviewRegex: state.searchVal
      }
    })
    .then(res => {
      let allFetchedReviews = [];
      res.data.data.forEach(x => allFetchedReviews.push(
        <ReviewCard 
          key={x['_id']}
          heading={`${x['User']['UserLogin']}, ${(new Date(x['ReviwedAt'])).toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric'})} at ${(new Date(x['ReviwedAt'])).toLocaleString('default', { timeStyle: 'long'})}`} 
          brandName={x['Product']['ProductBrand']} 
          productName={x['Product']['ProductName']}
          review={x['ReviewText']}
        />));
      globalSetState({...globalState, allReviewCards: allFetchedReviews});
    })
    .catch(error => {
        console.log (`Error fetching all the reviews while mounting the home page with error: ${error}`);
    });
  }

  return (
      <TextField
        id="home-search-bar"
        placeholder="Search for a product or friend"
        className={classes.searchTextField}
        value={state.searchVal}
        onChange={(event) => {
            setState({...state, searchVal: event.target.value})
            if (event.target.value === ''){
              refreshAllReviews();
              return;
            }
          }
        }
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            handleSubmit();
            event.preventDefault();
          }
        }}
        margin="normal"
        variant="outlined"
        InputLabelProps={{
          style: {
            fontSize: '13px'
          },
          classes: {
            root: classes.cssLabel,
            focused: classes.cssFocused,
          },
        }}
        InputProps={{
          inputProps: {
            style: { textAlign: "center", fontSize: '13px' },
          },
          endAdornment: (
            <InputAdornment position="start">
                <IconButton onClick={handleSubmit}>
                  <SearchIcon />
                </IconButton>
            </InputAdornment>
            ),
          classes: {
            root: classes.cssOutlinedInput,
            focused: classes.cssFocused,
            notchedOutline: classes.notchedOutline,
          },
          inputMode: 'numeric',
        }}
      />
  );
}

CustomSearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(LoginFormStyler("center"))(CustomSearchBar);