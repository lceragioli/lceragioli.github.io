type a_exp =
    Aval of int
  | Plus of a_exp * a_exp
  | Minus of a_exp * a_exp
  | Times of a_exp * a_exp
  | Of_bool of b_exp
and b_exp =
Bval of bool
  | And of b_exp * b_exp
  | Or of b_exp * b_exp
  | Not of b_exp
  | Minor of a_exp * a_exp

let rec a_eval = function
  | Aval n -> n
  | Plus (a1, a2) -> 
      let n1 = a_eval a1
      and n2 = a_eval a2
      in n1 + n2
  | Minus (a1, a2) -> 
      let n1 = a_eval a1
      and n2 = a_eval a2
      in n1 - n2
  | Times (a1, a2) -> 
      let n1 = a_eval a1
      and n2 = a_eval a2
      in n1 * n2
  | Of_bool b ->
      if b_eval b then 1 else 0
and b_eval = function
  | Bval t -> t
  | And (b1, b2) -> 
      let t1 = b_eval b1
      and t2 = b_eval b2
      in t1 && t2
  | Or (b1, b2) -> 
      let t1 = b_eval b1
      and t2 = b_eval b2
      in t1 || t2
  | Not b -> 
      let t = b_eval b
      in not t
  | Minor (a1, a2) ->
      let n1 = a_eval a1
      and n2 = a_eval a2
      in n1 < n2 
