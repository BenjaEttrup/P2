function elementRemove(index, array){
    for (let i = 0; i < array.length-1; i++){
      if (i >= index){
        array[i] = array[i+1];
      }
    }
    array.length--;
}

let array = ["a", "b", "c", "d"];
let tempArray = array.slice();

elementRemove(1, array);

console.log(array);
console.log(tempArray);