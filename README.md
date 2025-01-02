# OPU NSKAL
 Nahrávací addon/extension/plugin/rozšíření NSKAL.
 
Psáno pro Chrome (testováno na nejnovějším pro Win 11) a Kiwi (nejnovější pro aktuální android na Pixel 8).
  
Cílem je vytvořit nahrávadlo, které umožní vybrat, nahrát na OPU a následně na okouna nasdílet více souborů najednou. Testováno na JPEGech.

Nemám vůbec žádné kóderské vzdělání/praxi, všechno napsal ChatGPT v neplacené verzi za asi dva večery, kdy jsem mu říkal, co chci a lozil různě v konzoli na OPU webu a tak. Tudíž to dost možná je celé strašlivý slepenec plný děr a tak, nevím, ale funguje to.

Pro fungování si musí NSKAL sosnout cookie, kterou OPU podsune uživateli při přihlášení. Tudíž se nejdřív přihlásit na OPU anebo být už přihlášený. Sosání se provádí v Options NSKALu klikem na tlačítko Fetch Cookie, následně uložit Save Settings. Cookie se nechá napsat i ručně.
<img src="https://opu.peklo.biz/p/25/01/02/1735796070-54418.jpg" alt="_"/>
 Options zavřít. Bez sosnuté cookie je uploadovací čudlík červený a uživatele vykopne do Options.
<img src="https://opu.peklo.biz/p/25/01/02/1735795915-9d891.jpg" alt="_"/>

V hlavním okně NSKALu
<img src="https://opu.peklo.biz/p/25/01/02/1735795734-b7b94.jpg" alt="_"/> 
- vybrat jeden či více souborů
- volitelně přepsat `<br>` tag na něco jinýho, ten se nakonec vloží mezi jednotlivé `<img src>`
- volitelně zakliknout Resize Image a napsat procento zmenšení
- Upload Files

Po nahrání se otevře nové okno s náhledama obrázků a editovatelné textové pole se seznamem `<img src>` všech obrázků s volitelným tagem mezi nima a čudlíkem Copy, který zkopíruje obsah pole do schránky.

Obrázky z OPU galerie si vybírá primitivně tak, že při uploadu n souborů si sosne hornich n souborů, asi to bude omezené limitem obrázků v galerii na stránce OPU. A nahrávání něčeho jiného než JPEGu může spustit různí efektové.

A to je celé to je.