type aexp =
	| Intliteral of int
	| Plus of aexp * aexp
	| Minus of aexp * aexp
	| Times of aexp * aexp

val eval : aexp -> int
