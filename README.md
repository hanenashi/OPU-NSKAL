# OPU NSKAL
Nahrávací addon/extension/plugin/rozšíření NSKAL.
  
Psáno pro Chrome na PC (testováno na nejnovějším pro Win 11), Kiwi na Androidu (testováno na nejnovějším pro aktuální android na Pixelu 8) a Firefox na PC (testováno na nejnovějším pro Win 11).
  
Cílem je vytvořit nahrávadlo, které umožní vybrat, nahrát na OPU a následně na okouna nasdílet více souborů najednou. Testováno na JPEGech.

Nemám vůbec žádné kóderské vzdělání/praxi, všechno napsal ChatGPT v neplacené verzi za asi dva večery, kdy jsem mu říkal, co chci a lozil různě v konzoli na OPU webu a tak. Tudíž to dost možná je celé strašlivý slepenec plný děr a tak, nevím, ale funguje to.

# INSTALACE

Pro Chrome a Kiwi si <a href="https://www.dropbox.com/scl/fi/7fqs2as9wxqqisqhukgqt/OPU_NSKAL_Chrome_v1.0.zip?rlkey=duk478cnq9l7i6vr2u2aavpnh&st=dgqbshw0&raw=1">stáhněte tenhle .zip</a>
<p>
Pro Firefox si <a href="https://www.dropbox.com/scl/fi/i5wvvacika5jc7ppdvu10/OPU_NSKAL_Firefox_1.0.xpi?rlkey=w9m7vhd97g91b7gtpl483zwdo&st=nd4tvpa7&raw=1">stáhněte tenhle .xpi</a>

## PRO CHROME

Vytvořte někde si libovolně pojmenovanej adresář a zip do něj rozbalte.<p>V nastavení extensions/rozšíření povolit Developer mode, kliknout na Load Unpacked a vybrat adresář s rozbaleným zipem.
<p>
<a href="https://opu.peklo.biz/p/25/01/04/1736009012-ec3ef.png"><img src="https://opu.peklo.biz/p/25/01/04/thumbs/1736009012-ec3ef.png"></a>
<br>
V Details si NSKALa připňete na lištu.
<p>
<a href="https://opu.peklo.biz/p/25/01/04/1736010265-7cc49.png"><img src="https://opu.peklo.biz/p/25/01/04/thumbs/1736010265-7cc49.png"></a>


## PRO KIWI

V Extensions povolte Developer mode, klikněte na +(from .zip/.crx/.user.js) a vyberte stáhnutej zip.
<br>
<a href="https://opu.peklo.biz/p/25/01/04/1736010763-1719c.png"><img src="https://opu.peklo.biz/p/25/01/04/thumbs/1736010763-1719c.png"></a><p>

## PRO FIREFOX

V Addons/Extensions nahrajte .xpi soubor klikem na Install Add-on From File, odsouhlaste
<img src="https://opu.peklo.biz/p/25/01/08/1736361568-a90fd.png" width=800>

<p>
a připněte si ho do lišty.<br>
<img src="https://opu.peklo.biz/p/25/01/08/1736361569-8a212.png" width=400 alt="_"/>

<p>

## JAK TO FUNGUJE

Pro hlavní okno NSKALu si ve Chrome a Firefoxu klikněte na ikonku NSKALa v liště, v Kiwi je pod třemi tečkami vpravo nahoře... dole.

Pro fungování si musí NSKAL sosnout cookie, kterou OPU podsune uživateli při přihlášení. Tudíž se nejdřív přihlásit na OPU anebo být už přihlášený. Sosání se provádí v Options NSKALu klikem na tlačítko Fetch Cookie, následně uložit Save Settings. Cookie se nechá napsat i ručně.<p>
<img src="https://opu.peklo.biz/p/25/01/02/1735796070-54418.jpg" width=400 alt="_"/><p>
 Options zavřít. Bez sosnuté cookie je uploadovací čudlík červený a uživatele vykopne do Options.
<img src="https://opu.peklo.biz/p/25/01/02/1735795915-9d891.jpg" width=400 alt="_"/>
<p>
V hlavním okně NSKALu<br>
<img src="https://opu.peklo.biz/p/25/01/02/1735795734-b7b94.jpg" width=400 alt="_"/> <p>
- vybrat jeden či více souborů<br>
- volitelně přepsat &lt;br&gt; tag na něco jinýho, ten se nakonec vloží mezi jednotlivé &lt;img src&gt;<br>
- volitelně zakliknout Resize Image a napsat procento zmenšení<br>
- Upload Files<br>

Po nahrání se otevře nové okno s náhledama obrázků a editovatelné textové pole se seznamem &lt;img src&gt; všech obrázků s tagem mezi nima a čudlíkem Copy, který zkopíruje obsah pole do schránky.
<p><img src="https://opu.peklo.biz/p/25/01/04/1736011312-91c3f.png" width=400 alt="_"/><p>


Obrázky z OPU galerie si vybírá primitivně tak, že při uploadu n souborů si sosne horních n souborů, asi to bude omezené limitem obrázků v galerii na stránce OPU. A nahrávání něčeho jiného než JPEGu asi může spustit mnozí efektové.

...a to je celé to je.
