(* The "simple" solution *)
let rec pack = function
  | [] -> []
  | n :: m :: ls when n = m -> 
      let ls' = pack (m :: ls) in
      (n :: (List.hd ls')) :: (List.tl ls')
  | n :: ls ->
      [n] :: (pack ls)

(* Using an accumulator *)
let acc_pack ls =
  let rec pack' current acc = function
  | [] -> acc
  | n :: m :: ls' when n = m -> 
      pack' (n :: current) acc (m :: ls')
  | n :: ls' ->
      pack' [] ((n :: current) :: acc) ls'
  in List.rev (pack' [] [] ls)

(* With higher order library functions, we will see them in the second lesson *)
let ho_pack ls =
  ls
  |> List.fold_left
      (fun a x -> 
        match a with
        | [] -> [[x]]
        | l1::ls1 when List.hd l1 = x -> 
            (x :: l1) :: ls1 
        | _ -> [x]::a
        )
      []
  |> List.rev

