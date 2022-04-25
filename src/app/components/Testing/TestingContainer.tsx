/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';

import Editor from './Editor';
import SelectorsButton from './SelectorsButton';
import {useAppSelector} from '../../state-management/hooks';
import {selectAtomsAndSelectorsState} from '../../state-management/slices/AtomsAndSelectorsSlice';
import './testing.css';
import {atom, selector} from 'recoil';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';


const Testing = () => {
  // retrieve snapshotHistory State from Redux Store
  const snapshotHistory = useAppSelector(
      state => state.snapshot.snapshotHistory,
  );
  
  
  // it seems that converting everything to state fixes most of our asynchronicity problems???
  
  const [ theObject, setTheObject ] = useState(JSON.parse(
    JSON.stringify(useAppSelector(selectAtomsAndSelectorsState)),
    ));
    // const theObject = JSON.parse(
      //   JSON.stringify(useAppSelector(selectAtomsAndSelectorsState)),
      // );
      
      // dot notation started working here for some reason. -- it's SUPER inconsistent though and you may need to go back. I think we have an asynchronicity problem.
      // const { atomsAndSelectors } = theObject;
      //const { $selectors, selectors, atoms } = theObject.atomsAndSelectors; // may need to switch back to just atomsAndSelectors;
      const [ selectorsFnAsStrings, setSelectorsFnAsStrings ] = useState(theObject.atomsAndSelectors.$selectors);
      const [ atoms, setAtoms ] = useState(theObject.atomsAndSelectors.atoms);
      const [ selectors, setSelectors ] = useState(theObject.atomsAndSelectors.selectors)
      //console.log('in container ', selectors, $selectors, atoms);
      
      
    //these will probably need to be state at some point in order to update them repeatedly.
  //const madeSelectors = {};
  const madeAtoms = {};

//hard coded atom for testing purposes - feel free to delete.
  const currentPlayer = atom({
    key: 'currentPlayer',
    default: 'X'
  });

  const current = useRecoilValue(currentPlayer);

// copmletely hard coded mySet selector for testing purposes.
// const mySet = useSetRecoilState(mySetSelector);
  // const currentPlayerStateSelector = selector($nextPlayerSetSelector);

  
  // convert the stringified version of selector set and get properties back to functions 
const selectorsClone = JSON.parse(JSON.stringify(selectorsFnAsStrings));

const [madeSelectors, setMadeSelectors] = useState(selectorsClone);

const object = {};

selectors.forEach(selectorKey => {
  // create a new recoil selector for each element in the selectorsArray and attach the to the madeSelectors object.
  if (selectorsClone[selectorKey]['set']) selectorsClone[selectorKey]['set'] = eval('(' + selectorsClone[selectorKey]['set'] + ')');
  if (selectorsClone[selectorKey]['get']) {
    selectorsClone[selectorKey]['get'] = eval('(' + selectorsClone[selectorKey]['get'] + ')')
  } else {
    //every thing must have a get, no matter what.
    selectorsClone[selectorKey]['get'] = ({get}) => {return};
  }
  setMadeSelectors(selectorsClone);
  object[selectorKey] = selector(selectorsClone[selectorKey]);
});

setMadeSelectors(object);
//set$Selectors(madeSelectors);

//testing out recoil playing nicely with redux. Sometimes random recoil hooks break everything.
const nextPlayerSetter = useSetRecoilState(madeSelectors['nextPlayerSetSelector'])

const [javascript, setJavascript] = useState('');



  return (
    //invoking an onclick to test out the fact that our selector works and is using the selector that WE MADE from our object.
   <div className='testing-container'>
     <div>
       {/* requires a parameter to be passed in, regardless of whether or not it's used. */}
       <button onClick={() => nextPlayerSetter(1)}>HELLO!</button>
       <h1>{current}</h1>
       <SelectorsButton
       key='selectors button'
       atoms={atoms}
       selectorsFnAsStrings={selectorsFnAsStrings}
       selectors={selectors}
       />
     </div>
     <div>
      {/* component that renders the expect test */}
     </div>
     <Editor
        onChange={setJavascript}
        value={javascript}
     />
   </div>
  )
};

export default Testing;

//when you select a selector
 // we have to grab that selector and save it to a variable with useSetRecoilState.
 // 


// Jester testing convo ---
