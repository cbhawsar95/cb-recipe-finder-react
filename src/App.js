import { useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Header from './components/HeaderComponent';
import Recipe from './components/RecipeComponent'

const APP_ID = "8d301db2";
const APP_KEY = "3addc387de61478cb83798b9f5a0b0dd"; 

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const RecipeListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 20px;
  justify-content: space-evenly;
`;

const PlaceHolder = styled.img`
  width: 120px;
  height: 120px;
  margin: 200px;
  opacity: 50%;
`

const RecipeComponent = (props) => {
  const [show, setShow] = useState(false);
  const { recipeObj } = props;

  return (
    <>
      <Dialog open={show}>
        <DialogTitle id="form-dialog-title">Hello Chanchal!</DialogTitle>
        <DialogContent>
          <table>
            <thead>
              <th>Ingredients</th>
              <th>Weight</th>
            </thead>
            <tbody>
              {recipeObj.ingredients.map((ingredientsObj) => (
                <tr>
                  <td>{ingredientsObj.text}</td>
                  <td>{ingredientsObj.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <Recipe.IngredientsText onClick={()=> window.open(recipeObj.url)}>See More</Recipe.IngredientsText>
          <Recipe.SeeMoreText onClick={()=> setShow(false)}>Close</Recipe.SeeMoreText>
        </DialogActions>
      </Dialog>
      <Recipe.RecipeContainer>
        <Recipe.CoverImage src={recipeObj.image} />
        <Recipe.RecipeName>{recipeObj.label}</Recipe.RecipeName>
        <Recipe.IngredientsText onClick={() => setShow(true)}>
          Ingredients
        </Recipe.IngredientsText>
        <Recipe.SeeMoreText onClick = {()=> window.open(recipeObj.url)}>
          See Complete Recipe
        </Recipe.SeeMoreText>
      </Recipe.RecipeContainer>
    </>
  )
}

function App() {
  const [timeoutId, updateTimeoutId] = useState()
  const [recipeList, updateRecipeList] = useState([])
  

  const fetchRecipe = async (searchString) => {
    const response = await Axios.get(
      `https://api.edamam.com/search?q=${searchString}&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    updateRecipeList(response.data.hits);
  };

  const onTextChange = (e) => {
    clearTimeout(timeoutId);
    const timeout =  setTimeout(() => fetchRecipe(e.target.value), 500);
    updateTimeoutId(timeout); 
  };

  return (
      <Container>
        <Header.Container>
          <Header.AppNameComponent>
            <Header.AppIcon src="hamburger.svg"/>
            Recipe Finder
          </Header.AppNameComponent>
          <Header.SearchComponent>
            <Header.SearchIcon src="search-icon.svg"/>
            <Header.SearchInput 
              placeholder="Search Recipe"
              onChange= {onTextChange} />
          </Header.SearchComponent>  
        </Header.Container>
        <RecipeListContainer>
          {recipeList.length ? (
           recipeList.map((recipeObj) => (
            <RecipeComponent recipeObj={recipeObj.recipe}/> ))
          ) : ( 
            <PlaceHolder src="hamburger.svg" /> 
          )}
        </RecipeListContainer>
      </Container>
  );
}

export default App;
