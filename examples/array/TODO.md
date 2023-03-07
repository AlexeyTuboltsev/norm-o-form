## simple
```
"name"
"password"
"repeat password"
```

## simple with behaviours

each next field becomes visible upon validation of the prev one
```
"name"
"password"
"repeat password"
```
## at least one valid member of array

shareholders
```
array add|move|remove person ---------------------------------------
"first name" "last name"                                            |
"birth date"                                                        |
"shares at the company" (must sum up to 100% across the array)      |
"social 1" (optional, valid url)                                    |
"social 2" (optional, valid url)                                    |
                                                                    |
array add move remove shares at other companies  -----              |
"company name"    "percentage"                        |             |
-------------------------------------------------------             |
---------------------------------------------------------------------

```

## many interdependent conditionals
company has branches
each branch can have one or more units - offices (with address) and warehouses (with optional geo coordinates)
some branches can only have either this or that.
```
[select branch]
array - add/remove/move unit
unit type - [office | warehouse] (if selection possible)
[office]:
[country] (usa | germany | UK)
"address one" 
"address two"
"place"
"zip (usa)" "[state]"
------------
"address one"
"plz (DE)" "Ort"
------
uk format...

[warehouse]
[country] (usa | germany | UK)
"address one"
"address two"
"place"
"zip (usa)" "[state]"
------------
"address one"
"plz (DE)" "Ort"
------
uk format...

optional---------------------------------
[coordinates format] decimal | degree   |
"lat" "long" (checked for correctness)  |
-----------------------------------------
```
