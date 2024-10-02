type 'a gtree =
    Leaf of 'a 
  | Node of 'a gtree list

let example_tree = 
  Node [Leaf 4; Leaf 5; Node [Node [Leaf 7]; Leaf 6]]
   