/**
 * Given a Boggle board and a dictionary, returns a list of available words in
 * the dictionary present inside of the Boggle board.
 * @param {string[][]} grid - The Boggle game board.
 * @param {string[]} dictionary - The list of available words.
 * @returns {string[]} solutions - Possible solutions to the Boggle board.
 */
 exports.findAllSolutions = function(grid, dictionary) {
  let solutions = [];

  // 1. Check inputs Params are valid (return [] if incorrect)
   
  // 1a. Check if any empty input
   if(grid == null || dictionary == null)
       return solutions;
   
  // 1b. Check if NXN
   let N = grid.length;
   
   for(let i = 0; i < N; i++) {
      if(grid[i].length != N ){ //|| grid[i] == []) {

          return solutions;
        
      }
   }

  // Convert input data into the same case
   
   convertCaseToLower(grid, dictionary);
   
  // Setup any data structures (i.e. Visited, solutions, dictionary (Trie | Hash | List | Set |)
   
   let trie = createHashMap(dictionary); //new Set(dictionary);
   
   let solutionSet = new Set();
   
  // Iterate over the NxN grid - find all words that begin with grid[y][x]
   
   for(let y = 0; y < N; y++){
     
      for(x = 0; x < N; x++){
        
           let word = "";
        
           let visited = new Array(N).fill(false).map(() => new Array(N).fill(false));
        
           findWords(word, y, x, grid, visited, trie, solutionSet);
      }
   }

  solutions = Array.from(solutionSet);
   
  return solutions;
}

convertCaseToLower = function(grid, dict){
  
  for(let i = 0; i < grid.length; i++) {
      for( let j = 0; j < grid[i].length; j++) {
           grid[i][j] = grid[i][j].toLowerCase();
      }
    
  }
  
  for(let i = 0; i < dict.length; i++) {
      dict[i] = dict[i].toLowerCase();
  }
}

findWords = function(word, y, x, grid, visited, trie, solutionSet){
   
  let adjMatrix = [[-1, -1],
                   [-1, 0],
                   [-1, 1],
                   [0, 1],
                   [1, 1],
                   [1, 0],
                   [1,-1],
                   [0, -1]];
  // Base Case: 
  // b1:  y and x are out of bounds
  // b2:  already visited y and x
  //  -->    then return immediately
  
  if (y < 0 || x < 0 || y >= grid.length || x >= grid.length || visited[y][x] == true)
         return;
  
  // Append grid[y][x] to the word
  
   word += grid[y][x];
  
  // console.log("Cur Word = " + word + "\nGrid[" + y + "][" + x + "] = " + grid[x][y]);
  
  // 1. Is that new word a prefix for any word in the trie
  
   if(isPrefix(word, trie)) {
      // 1a. Is that prefix an actual word in the dictionary (trie)
          
          visited[y][x] = true;
     
          if(isWord(word, trie)) {
  
          // 1b.  If true AND word size > 3--> add word to solutionSet
            
              if(word.length >= 3)
                  solutionSet.add(word);
  
          }
      // 2.  keep searching using the adjacent tiles --> Call findWord()
  
          for(let i = 0; i < 8; i++){
            
              findWords(word, y + adjMatrix[i][0], x + adjMatrix[i][1], grid, visited, trie, solutionSet);
          }
   }
  
  // 3. If not a prefix then unmark location y, x as visited
  
   visited[y][x] = false;

 }

isPrefix = function(word, trie){
  //Iterate through each word in the trie, and check if the word is a prefix
  
  return trie[word] != undefined;
   
}

isWord = function(word, trie){
 
  return trie[word] == 1;
  
}

createHashMap = function(dictionary){
  var dict = {};
  for(let i = 0; i < dictionary.length ; i++){
    dict[dictionary[i]]= 1;
    let wordlength = dictionary[i].length;
    var str = dictionary[i];
    for(let j = wordlength; wordlength > 1; wordlength--){
      str = str.substr(0,wordlength-1);
      if(str in dict){
        if(str == 1 ){
          dict[str]= 1;
        }
      }
      else{
        dict[str]= 0;
      } 
    }
  }
  return dict;
}

const grid = [['T', 'W', 'Y', 'R'],
              ['E', 'N', 'P', 'H'],
              ['G', 'Z', 'Qu', 'R'],
              ['O', 'N', 'T', 'A']];
const dictionary = ['art', 'ego', 'gent', 'get', 'net', 'new', 'newt', 'prat',
                    'pry', 'qua', 'quart', 'quartz', 'rat', 'tar', 'tarp',
                    'ten', 'went', 'wet', 'arty', 'egg', 'not', 'quar'];


console.log(exports.findAllSolutions(grid, dictionary));


/*
MIN_SIZE = 3; //Ensures words are no less than 3 letters
Qu = '&'; //Replaces Qu with & (Will return back to Qu at the end)
/// grid = null; //Starts with an empty grid
// change var to exports.
// before was exports.findAllSolutions = function(param1, param2)
exports.findAllSolutions = function (grid, dictionary) {
  let finalResult = [];  
  let MAX_NEIGHBORS = 0; 
  let TOTAL_ELEMENTS = 0;
  let gridSize = [0, 0]; // [1,1] or [2,2] or [3,3] etc 
  // calculate size of gd
  let rowLength = grid.length; 
  let columnLength = grid[0] != undefined ? grid[0].length : 0; // if the array grid passed in has no elements, then return 0 
  
  if ((rowLength == columnLength ) && (rowLength == 2) ){
    // 2X2  [["A", "B"], ["C", "D"]]; 
    MAX_NEIGHBORS = 3; 
    TOTAL_ELEMENTS = 4; 
    let all_letters = parseLetters(grid); 
    for (const word of dictionary){
          let isSolution = calculateSolution(word, all_letters, TOTAL_ELEMENTS, MAX_NEIGHBORS); 
          if (isSolution){
            finalResult.push(word);
          }
      }
  }else if (rowLength == columnLength && rowLength > 2){
     // 3X3  [['A', 'B', 'C'], ['D', 'E', 'F'],  ['G', 'H', 'I']];
     // and all other types of grids 
     MAX_NEIGHBORS = 8; 
     TOTAL_ELEMENTS = rowLength * columnLength; // must be calculated b/c we cannot assume 
     let all_letters = parseLetters(grid);  // letters are parsed into an object 
     for (const word of dictionary){
          let isSolution = calculateSolution(word.replace("QU", "&"), all_letters, TOTAL_ELEMENTS, MAX_NEIGHBORS); 
          if (isSolution){
            word.replace("&", "QU"); 
            finalResult.push(word);
          }
      }

  }else{
    // 0X0 or 1X1 do nothing and return the blank finalresult
  }
 // console.log("finalResult -- array");
 // console.log(finalResult);
  return finalResult; 
}



// parses all letters in the grid to an object that stores the x and y coordinates, has it been visited, and the letter character itself 
// also converts all 'QU's to & 
function parseLetters(grid){
  let all_letters = []; 
  for (var r = 0; r < grid.length; r++)
    for (var c = 0; c < grid[0].length; c++){
      let letterObject  = {
        x:c, // x coordinate 
        y:r,  // y coordinate 
        letter : grid[r][c].toUpperCase() == "QU" ? "&" :  grid[r][c].toUpperCase(),
        visited:false
      }
      all_letters.push(letterObject); 
    }
    return all_letters;
}

/**
 *  Need to see if the word exists in the letter object (TODO)
 * Calculate the neighbhors to see who is eligible 
 * pick among those who is adjacent to the current letter 
 * reset all the objects back to visited false so we can search the next word
 * if letter (among that word) is eligible, then we return true . If not, then return false. 
 * 
 * CASE 1: THE FIRST letter does not exist in the set of letters 
 * CASE 2: THE SECOND or third or fourth or etc... LETTER  DOES NOT EXIST IN THE SET OF LETTERS. 
 * @param {*} word 
 * @param {*} letter_objects 
 * @param {*} total_num_of_elements 
 * @param {*} max_neighbors 
 */

/*
function calculateSolution(word, letter_objects, total_num_of_elements, max_neighbors){
  let isSolution = false; 
  let isFirstLetterBeingObserved = true; 
  let foundFirstLetter = false;
  let foundOthersLetter = false;
  let numberOfFoundLetters = 0; 
  let containQu = word.search("QU") != - 1 ;
  let quCount = containQu ? 1 : 0; 
  // change word to & 
  word = containQu ? word.replace("QU", "&") : word; 
  if (word.length + (quCount) < 3 )
    return false; 
  //_log( "All Letters from the grid " + JSON.stringify(letter_objects)); 
  //_log(word, letter_objects, total_num_of_elements, max_neighbors); 
  for (const dict_letter of word) { // so this is the A in ABC
    
      for (let i = 0; i < letter_objects.length; i++){ // These are all the letters we have to search in,
          const grid_letter_obj = letter_objects[i];
          if (isFirstLetterBeingObserved){
            // if first letter is found in the objects, then we can just search for the value. NO need to check neighbors 
            if (grid_letter_obj.letter == dict_letter && !grid_letter_obj.visited){
                grid_letter_obj.visited  = true; // we found a match letter.
                foundFirstLetter = true; 
                foundOthersLetter = true; 
                isFirstLetterBeingObserved = false; 
                numberOfFoundLetters++; // increment each we find a letter, if this number == word count, then we have succeeded;   
                i = letter_objects.length - 1; // first letter found, try other letters from the word as a dict_letter. 
                // _log(`YEAH! Found First Leter ? ${foundFirstLetter}  Letters Found ${numberOfFoundLetters}`); 
              }
             // _log(`Found First Leter ? ${foundFirstLetter}  Letters Found ${numberOfFoundLetters}`); 
          }else {
              // search the above criteria and include searching for the neighbors. 
            //  _log(` ${grid_letter_obj.letter} these are equal? ${dict_letter}`);
              if (grid_letter_obj.letter == dict_letter && !grid_letter_obj.visited){
          //      _log(`Found a match with the other letters?  with letter ${dict_letter} `); 
                if (isLetterAdjacentToOneOfThePreviousFoundLetters(grid_letter_obj, letter_objects, max_neighbors, total_num_of_elements)){
                  grid_letter_obj.visited =  true; 
                  foundFirstLetter = true; 
                  foundOthersLetter = true; 
                  numberOfFoundLetters++; 
                  i = 0; 
                  if (numberOfFoundLetters == word.length){
                    resetAllLetters(letter_objects);
                    // done searching letters; 
                    return true; 
                  }
                }
              }
          }
         
      }
        // after searching for this particular letter... ask this? Did we find it? If not, stop searching for it. 
      if (foundFirstLetter == false){
    //    _log(`Found First Leter ? ${foundFirstLetter}  Letters Found ${numberOfFoundLetters}`); 
        return false; // since the first letter was not in the set of our letters, then we stop searching for all the others. 
      }else if (foundOthersLetter == false){
      //  _log(`Found Other Letters ? ${foundOthersLetter}  Letters Found ${numberOfFoundLetters}`); 
        return false;// because this 2nd or higher letter was not found. So we stop iterating 
       
      }
      firstLetter = false; 
      foundOthersLetter = false;// reset the value so we search for the next letter. If it is found, we make it true and we keep going. 
  }


  // does letter exist in the letter objects. if not, then return false

  return isSolution; 
}


function resetAllLetters(letter_objects){ //resets all of the letters
  letter_objects = letter_objects.map(l => {
    l.visited = false;
    return l;
  });
}

function isLetterAdjacentToOneOfThePreviousFoundLetters(letter_obj, all_letter_objects_to_search, max_adjacents, total_num_of_elements){

  let row_count = column_count = parseInt(Math.sqrt(total_num_of_elements)); 
  // calculate all the neighbors /adjacents by placing coordinates in a 2d array; [[2,3], [1,2]]
  let all_coordinates = []; 
  for (let y = 0; y < row_count; y++){
    for (let x = 0; x < column_count; x++){
        all_coordinates.push([x, y]);
    }
  }

  let eligible_letters = []; // all eligible AND (AND!!!) ADJACENT 
  // actual eligible elements. E.g. in a 4X4, letter at 3,3 only has 3 adjacent values 
  // calculate by math, for the 2 by 2 array, find all hypothetical values, but we know only 3 are feasbile 
  for (let add = 0; add < 8; add++){

        switch (add){
          case 0: 
          // x + 1, y  RH 
            if (coordinatesExist(letter_obj.x + 1, letter_obj.y, all_coordinates)){
              eligible_letters.push(findLetterByCoordinates(letter_obj.x + 1, letter_obj.y, all_letter_objects_to_search)); 
            }
            break; 
          case 1: 
          // x - 1, y  LH 
            if (coordinatesExist(letter_obj.x - 1, letter_obj.y, all_coordinates)){
              eligible_letters.push(findLetterByCoordinates(letter_obj.x - 1, letter_obj.y, all_letter_objects_to_search)); 
            }
            break; 
          case 2: 
          // x , y + 1  UP 
            if (coordinatesExist(letter_obj.x, letter_obj.y + 1, all_coordinates)){
              eligible_letters.push(findLetterByCoordinates(letter_obj.x, letter_obj.y + 1, all_letter_objects_to_search)); 
            }
            break; 
          case 3: 
          // x , y - 1 DN 
            if (coordinatesExist(letter_obj.x, letter_obj.y - 1, all_coordinates)){
              eligible_letters.push(findLetterByCoordinates(letter_obj.x, letter_obj.y - 1, all_letter_objects_to_search)); 
            }
            break; 
          case 4: 
          // x + 1, y + 1 TR 
            if (coordinatesExist(letter_obj.x + 1, letter_obj.y + 1, all_coordinates)){
              eligible_letters.push(findLetterByCoordinates(letter_obj.x + 1, letter_obj.y + 1, all_letter_objects_to_search)); 
            }
            break; 
          case 5: 
          // x - 1, y - 1 DL 
            if (coordinatesExist(letter_obj.x - 1, letter_obj.y - 1, all_coordinates)){
              eligible_letters.push(findLetterByCoordinates(letter_obj.x - 1, letter_obj.y - 1, all_letter_objects_to_search)); 
            }
            break;
          case 6: 
          // x - 1, y + 1 TL 
            if (coordinatesExist(letter_obj.x - 1, letter_obj.y + 1, all_coordinates)){
              eligible_letters.push(findLetterByCoordinates(letter_obj.x - 1, letter_obj.y + 1, all_letter_objects_to_search)); 
            }
            break; 
          case 7: 
          // x + 1, y - 1 DR 
            if (coordinatesExist(letter_obj.x + 1, letter_obj.y - 1, all_coordinates)){
              eligible_letters.push(findLetterByCoordinates(letter_obj.x + 1, letter_obj.y - 1, all_letter_objects_to_search)); 
            }
            break;  
        }
      
    } // for loop to calculate all the adjacent values 

    // check among the elgible letters, which ones are visited . 
    // first ask who is visited. If none are visited (visited true length == 0), then all these adjecents don't count; // return  false; 
    if (eligible_letters.filter(l => l.visited == true).length == 0 ){
      return false; 
    }else {
      return true; // means that we found  at least one element that was adjacent 
    }

  }

function coordinatesExist(x, y, all_coords){
    let foundElements = 0; 
    foundElements = all_coords.filter(c => c[0] == x && c[1] == y).length; 
    return foundElements == 1 ; 
}


function findLetterByCoordinates(x, y, all_letter_objects_to_search){
  return all_letter_objects_to_search.filter(obj => obj.x == x && obj.y == y)[0]; 
}


//function _log(str){
//  console.log(str); 
}
*/
// temp 5

// function ToGrid(...rows) {
//   return rows.map(row => row.split(""));
//   }
  
//   /** Lowercases a string array in-place. (Used for case-insensitive string array
  
//   matching).
//   @param {string[]} stringArray - String array to be lowercase.
//   */
//   function lowercaseStringArray(stringArray) {
//     for (let i = 0; i < stringArray.length; i++)
//     stringArray[i] = stringArray[i].toLowerCase();
//     }
  


//let grid = [["A", "B"], ["C", "D"]];
// let grid = [["A", "QU"], ["C", "D"]];
// let dict = ["AQU"];
// let solutions = findAllSolutions(grid, dict);
// _log(solutions); 
// let expected = ["ABD", "DCA"];

