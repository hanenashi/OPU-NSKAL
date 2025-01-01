# OPU NSKAL
 Upload files and fetch gallery links from OPU
 
 Nahravaci addon/extension/plugin/rozsireni pro Chrome, NSKAL.
 
(testovano na nejnovejsim pro Win 11) a Kiwi (nejnovejsi pro aktualni android na Pixel 8).
  
Cilem je vytvorit nahravadlo, ktere umozni vybrat, nahrat a nasledne na okouna nasdilet vicero souboru najednou. 

Nemam vubec zadne koderske vzdelani/praxi, vsechno napsal ChatGPT v neplacene verzi za asi dva vecery, kdy jsem mu rikal, co chci a lozil ruzne v konzoli na OPU webu a tak. Tudiz to dost mozna je cele straslivej slepenec plnej der a tak, nevim, ale funguje to.

Pro fungovani si musi NSKAL sosnout cookie, kterou OPU podsune uzivateli pri prihlaseni. Tudiz se nejdriv prihlasit na OPU anebo byt prihlaseny. Sosani se provadi v Options NSKALu klikem na tlacitko Fetch Cookie, nasledne ulozit Save Settings. Options zavrit. Bez sosnute cookie je uploadovaci cudlik cervenej a uzivatele vykopne do Options.

V hlavnim okne NSKALu vybrat jeden ci vice souboru, volitelne prepsat <br> tag, kterej se nakonec vlozi mezi jednotlive <img src>, volitelne zakliknout Resize Image a napsat procento zmenseni a Upload Files.

Po nahrani se otevre nove okno s nahledama obrazku a editovatelny textovy pole se seznamem <img src> vsech obrazku s volitelnym tagem mezi nima a cudlikem Copy, kterej zkopiruje obsah pole do schranky.

A to je cele to je.

Zkousel jsem to predelat do Fire Foxe, ale bezvysledne.