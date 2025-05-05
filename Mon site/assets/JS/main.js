console.log("main.js chargé !");
//probleme avec mon JS, je voulais verifier qu'il sois bien chargé
//spoiler alert, il ne l'etait pas
//ça affiche quelque chose dans la consolle

// Afficher / Masquer aboutme -----------------------------------------------------------------------
function showHide_aboutme() {
    const div = document.getElementById("aboutme"); // Récupère l'élément avec l'ID "aboutme"
    const button = document.getElementById("button_aboutme"); // Récupère le bouton 

// Ici getElementById est une fonction native de JS. Elle permet d'aller chercher un element dans le DOM
// grace a son iddentifiant directement dans notre code HTML. 

// Si la section est actuellement visible (classe "show" présente)
    if (div.classList.contains("show")) {
        div.classList.remove("show"); // retire la classe pour cacher la section
        button.innerHTML = "Montrer le CV"; // met à jour le texte du bouton
    } else { //donc si show n'est pas present
        div.classList.add("show"); //ajoute la classe pour afficher la section
        button.innerHTML = "Cacher le CV"; //met à jour le texte du bouton
    }
}

// Ici innerHTML sert a lire/changer un bout de code dans notre DOM.
// classList permet quand a lui de manipuler la classe d'un element

// Afficher / Masquer l'aide --------------------------------------------------------------------------
function showHide_aide() {
    let div = document.getElementById("aide_content");
    let button = document.getElementById("button_aide_2");

    // Si la section d'aide est cachée, on l'affiche
    if (div.style.display === "none") {
        div.style.display = "block";
        button.innerHTML = "Masquer l'aide";
    } else {
        div.style.display = "none";
        button.innerHTML = "Afficher l'aide";
    }
}

/*------------------------------------------------------------------------------------------------------------------*/
//							OUTIL D'ANALYSE des données dans un fichier									//
/*------------------------------------------------------------------------------------------------------------------*/

// Charger le texte -----------------------------------------------------------------------
window.onload = function() {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');

    // On "écoute" si le fichier donné a été modifié.
    // Si on a donné un nouveau fichier, on essaie de le lire.
    fileInput.addEventListener('change', function(e) {  //addEventListener a été utilisée en faisant référence à https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_element_addeventlistener2
        
        let file = fileInput.files[0];
        // on utilise cette expression régulière pour vérifier qu'on a bien un fichier texte.
        let textType = new RegExp("text.*");

        if (file && textType.test(file.type)) { // Ajout perso : vérifie le type du fichier *2 pour lancer la boucle
            let reader = new FileReader(); // Création du lecteur de fichier




            // lecture du fichier. D'abord, on crée un objet qui sait lire un fichier.
            

            // on dit au lecteur de fichier de placer le résultat de la lecture
            // dans la zone d'affichage du texte.
            reader.onload = function(e) {
                fileDisplayArea.innerText = reader.result;   // Affiche le contenu du fichier
                segText(); // Appel de la fonction de segmentation (définie plus bas)
            
                // Correction ici :
                let nbLines = reader.result.split('\n').length;
                let nbTokens = reader.result.split(/\s+/).filter(t => t.length > 0).length;
            
                document.getElementById("logger2").innerHTML = 
                    '<span class="infolog">Nombre de tokens : ' + nbTokens + 
                    '<br>Nombre de lignes : ' + nbLines + ' </span>';
            };

            // on lit concrètement le fichier.
            // Cette lecture lancera automatiquement la fonction "onload" juste au-dessus.
            reader.readAsText(file);

            document.getElementById("logger1").innerHTML = 
                '<span class="infolog">Fichier chargé avec succès</span>';
        } else { // pas un fichier texte : message d'erreur.
            fileDisplayArea.innerText = "";
            document.getElementById("logger1").innerHTML = '<span class="errorlog">Type de fichier non supporté !</span>';
        }
    });
};//il manquait un point virgule




// VERSION segText() ------------------------------------------------------------------------
function segText() {
    if (document.getElementById('fileDisplayArea').innerHTML==""){
        document.getElementById('logger3').innerHTML="Il faut d'abord charger un fichier .txt !";
    } else {
        if (document.getElementById("delimID").value === "") {
            document.getElementById("logger3").innerHTML = '<span class="errorlog">Aucun délimiteur donné !</span>'
        }else{
            document.getElementById('logger3').innerHTML="";
            let text = document.getElementById("fileDisplayArea").innerText;
            let delim = document.getElementById("delimID").value;
            let display = document.getElementById("logger1");
        
            let regex_delim = new RegExp(
                "["
                + delim
                    .replace("-", "\\-") // le tiret n'est pas à la fin : il faut l'échapper, sinon erreur sur l'expression régulière
                    .replace("[", "\\[").replace("]", "\\]") // à changer sinon regex fautive, exemple : [()[]{}] doit être [()\[\]{}], on doit "échapper" les crochets, sinon on a un symbole ] qui arrive trop tôt.
                + "\\s" // on ajoute tous les symboles d'espacement (retour à la ligne, etc)
                + "]+" // on ajoute le + au cas où plusieurs délimiteurs sont présents : évite les tokens vides
            );
        
            let tokens = text.split(regex_delim);
            tokens = tokens.filter(x => x.trim() != ""); // on s'assure de ne garder que des tokens "non vides"
            let lines = text.split("\n");
            lines = lines.filter(line => line.trim() != "");
        
            global_var_tokens = tokens; // décommenter pour vérifier l'état des tokens dans la console développeurs sur le navigateur
            global_var_lines = lines;
            display.innerHTML = tokens.join(" ");
        }
    }
}


// Fonction qui affiche un tableau des tokens classés par fréquence
function dictionnaire() {

    // Vérifie si aucun fichier texte n'a été chargé
    // Si fileDisplayArea est vide, c'est que l'utilisateur n’a pas encore chargé de fichier
    if (document.getElementById('fileDisplayArea').innerHTML == "") {
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !";
    } else {
        document.getElementById('logger3').innerHTML = "";

        // Objet qui contiendra chaque token comme clé, et le nombre d'occurrences comme valeur
        let tokenFreq = {};

        // On récupère la variable globale contenant les tokens générés par segText()
        let tokens = global_var_tokens;

        // Pour chaque token, on incrémente sa fréquence dans l'objet tokenFreq
        tokens.forEach(token => {
            tokenFreq[token] = (tokenFreq[token] || 0) + 1;
        });

        // On convertit l’objet en tableau de paires [token, fréquence]
        let freqPairs = Object.entries(tokenFreq);

        // On trie les paires par ordre décroissant de fréquence (du plus fréquent au moins fréquent)
        freqPairs.sort((a, b) => b[1] - a[1]);

        // On crée un tableau HTML, avec une ligne d'en-tête
        let tableArr = [['<b>Token</b>', '<b>Fréquence</b>']];

        // On ajoute toutes les lignes du dictionnaire
        let tableData = freqPairs.map(pair => [pair[0], pair[1]]);

        // On fusionne l’en-tête et les données
        let finalTable = tableArr.concat(tableData);

        // On génère le HTML : chaque ligne devient une <tr>, chaque cellule une <td>
        let tableHtml = finalTable.map(row =>
            '<tr>' + row.map(cell => '<td>' + cell + '</td>').join('') + '</tr>'
        );

        // On injecte le tableau HTML dans la page
        document.getElementById('page-analysis').innerHTML = '<table>' + tableHtml.join('') + '</table>';
    }
}



// GREP ---------------------------------------------------------------------
function grep() {
    // Vérifier si un fichier .txt a été chargé
    if (document.getElementById('fileDisplayArea').innerHTML == "") {
        // Afficher un message d'erreur
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !";
    } else {
        // Effacer tout message d'erreur précédent
        document.getElementById('logger3').innerHTML = "";

        // Récupérer la valeur du champ "pôle"
        let poleInput = document.getElementById("poleID").value; //récupération de la valeur du champ pôle

        // Vérifier si un pôle a été saisi
        if (poleInput == "") { //vérification si le champ est vide
            // Afficher un message d'erreur
            document.getElementById('logger3').innerHTML = "Il faut d'abord entrer un pôle !";
        } else {
            // Créer une expression régulière à partir de la valeur du champ "pôle"
            let poleRegex = new RegExp(poleInput, 'gi'); // Ajout de 'i' pour rendre la recherche insensible à la casse

            // Initialiser la variable "resultat" avec l'entête du tableau
            let resultat = "<tr><th>Ligne</th><th>Résultat</th></tr>";

            // Parcourir chaque ligne du tableau "global_var_lines"
            for (let i = 0; i < global_var_lines.length; i++) { //boucle sur la bonne variable
                // Vérifier si la ligne correspond à la regex
                if (poleRegex.test(global_var_lines[i])) { //test de correspondance avec RegExp
                    // Ajouter le numéro de la ligne et le résultat correspondant au tableau "resultat"
                    let lineNumber = i + 1; // Ajouter 1 car les tableaux en JavaScript commencent à l'index 0
                    resultat += "<tr><td>" + lineNumber + "</td><td>" + global_var_lines[i] + "</td></tr>"; //construction propre de la ligne HTML
                }
            }

            // Vérifier si des résultats ont été trouvés
            if (resultat == "<tr><th>Ligne</th><th>Résultat</th></tr>") {
                // Effacer les résultats précédents
                document.getElementById('page-analysis').innerHTML = "";
                // Afficher un message d'erreur
                document.getElementById('logger3').innerHTML = "Aucune correspondance trouvée.";
            } else {
                // Effacer tout message d'erreur précédent
                document.getElementById('logger3').innerHTML = "";
                // Injecter le tableau résultant dans l'élément HTML
                document.getElementById('page-analysis').innerHTML = "<table>" + resultat + "</table>";
            }
        }
    }
}

// Concordancier ---------------------------------------------------------------------------
function concord() {
    if (document.getElementById('fileDisplayArea').innerHTML == "") {
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !";
    } else {
        document.getElementById('logger3').innerHTML = "";

        // Récupérer la valeur du champ "pôle"
        let poleInput = document.getElementById('poleID').value; //bon ID et accès à .value

        if (poleInput == "") {
            document.getElementById('logger3').innerHTML = "Il faut d'abord entrer un pôle !"; //message d'erreur
        } else {
            document.getElementById('logger3').innerHTML = "";

            let lgInput = document.getElementById('lgID').value; // voir bouton "longueur" dans index.html

            // Vérifier si une longueur a été saisi, et si > 0
            if (lgInput == "" || parseInt(lgInput) <= 0) {  //ajout vérification numérique > 0
                // Afficher un message d'erreur
                document.getElementById('logger3').innerHTML = "Il faut d'abord entrer une longueur > 0 !";
            } else {
                // Récupérer le pôle et le convertir en regex
                let poleRegex = new RegExp("^" + poleInput + "$", "gi"); // le "i" indique de ne pas prendre en compte la casse, ^ et $ pour délimiter le mot

                // Récupérer la valeur de "lgInput" (longueur de contexte) et conversion en nombre entier
                let long = parseInt(lgInput); //remplacement de document.xx

                // Chercher le pôle et créer une liste de concordance avec la méthode Array.prototype.reduce()
                // On applique .reduce sur global_var_tokens. Le callback prend en paramètres acc : accumulateur initialisé à [], token : valeur courante ; i : index
                let concordance = global_var_tokens.reduce((acc, token, i) => {
                    // À chaque itération, on teste si le "poleRegex" correspond au token courant
                    if (poleRegex.test(token)) {
                        // Création du contexte gauche (cLeft) et droit (cRight)
                        let cLeft = global_var_tokens.slice(Math.max(0, i - long), i).join(" ");
                        let cRight = global_var_tokens.slice(i + 1, Math.min(global_var_tokens.length, i + long + 1)).join(" ");
                        acc.push([cLeft, token, cRight]); // Ajout (contexte gauche, pôle, contexte droit)
                    }
                    return acc;
                }, []); //initialisé comme tableau vide

                // Afficher les résultats dans une table HTML
                let table = document.createElement("table"); //création de la table HTML

                table.innerHTML = "<thead><tr><th>Contexte gauche</th><th>Pôle</th><th>Contexte droit</th></tr></thead>"; //en-tête de tableau complet

                concordance.forEach(([cLeft, pole, cRight]) => {
                    // Insertion d'une nouvelle ligne dans la table
                    let row = table.insertRow();
                    // Ajouter les données à la ligne
                    row.insertCell().textContent = cLeft;
                    row.insertCell().textContent = pole;
                    row.insertCell().textContent = cRight;
                });

                // Vérifier si des résultats ont été trouvés
                if (concordance.length === 0) { //test sur la longueur réelle de la liste
                    // Effacer les résultats précédents
                    document.getElementById('page-analysis').innerHTML = "";
                    // Afficher un message d'erreur
                    document.getElementById('logger3').innerHTML = "Aucune concordance trouvée.";
                } else {
                    // Effacer tout message d'erreur précédent
                    document.getElementById('logger3').innerHTML = "";
                    // Injecter le tableau résultant dans l'élément HTML
                    document.getElementById("page-analysis").innerHTML = "";
                    document.getElementById("page-analysis").appendChild(table);
                }
            }
        }
    }
}

// Nombre de phrases -----------------------------------------
function nbPhrases() {
    if (document.getElementById('fileDisplayArea').innerHTML == "") {
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !";
    } else {
        document.getElementById('logger3').innerHTML = "";

        let text = document.getElementById("fileDisplayArea").innerText; //récupérer le texte brut affiché à l'écran

        let phrase = /[.!?]+/g; // Expression régulière pour repérer les fins de phrase (un ou plusieurs ponctuations)

        let nbPhrases = text.split(phrase); //on découpe le texte à chaque fin de phrase

        // On filtre les éléments vides après le split (par exemple s’il y a des points multiples ou en fin de texte)
        nbPhrases = nbPhrases.filter(p => p.trim().length > 0); 

        let resultat = nbPhrases.length; //le nombre de phrases est la taille du tableau

        document.getElementById('page-analysis').innerHTML =
            '<div>Il y a ' + resultat + ' phrases dans ce texte.</div>';
    }
}


// Mots les plus longs ----------------------------------------------
function tokenLong() {
    if (document.getElementById('fileDisplayArea').innerHTML == "") {
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !"; //remplacer XX par logger3 + message d'erreur
    } else {
        document.getElementById('logger3').innerHTML = ""; //efface le message d'erreur si tout est OK

        // Trier le tableau 'global_var_tokens' par ordre décroissant de longueur
        // et garder les X premiers éléments (optionnel : ici on garde tout)
        let tokenSort = global_var_tokens.sort((a, b) => b.length - a.length); //fonction de tri correcte

        // Convertir chaque token en une ligne de tableau HTML avec sa longueur
        let map = tokenSort.map(token =>
            '<tr><td>' + token + '</td><td>' + token.length + '</td></tr>'
        ).join('');

        // Tableau HTML
        let resultat = '<table>' +
            '<tr><th colspan=2><b>Mots les plus longs</b></th></tr>' + //titre du tableau
            '<tr><th><b>Mot</b></th><th><b>Longueur</b></th></tr>' +    //titres des colonnes
            map +
            '</table>'; //fermeture correcte du tableau

        // Injecter le tableau dans l'élément HTML
        document.getElementById('page-analysis').innerHTML = resultat; //insertion dans la bonne zone
    }
}


// Pie Chart (mots les plus fréquents, moins les stopwords) --------------------------------------------------
function pieChart() {
    // Vérifie si un texte a été chargé
    if (document.getElementById('fileDisplayArea').innerHTML == "") {
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !"; //message d’erreur affiché si pas de fichier
    } else {
        // Réinitialise les anciens messages
        document.getElementById('logger3').innerHTML = ""; //ligne manquante pour vider l’erreur précédente

        // Récupérer les stopwords depuis le champ input
        var stopwordInput = document.getElementById("stopwordID").value; //bon ID + récupération de .value

        var stopwords = stopwordInput.split(",").map(sw => sw.trim().toLowerCase()); //trim + toLowerCase pour éviter les erreurs dues à des espaces ou majuscules

        // Filtrer les stopwords de global_var_tokens
        var filteredTokens = global_var_tokens.filter(function(token) {
            return stopwords.indexOf(token.toLowerCase()) === -1; //comparaison en minuscules
        });

        // Compter le nombre d'occurences de chaque token dans "filteredTokens"
        var count = {};
        filteredTokens.forEach(function(token) {
            count[token] = (count[token] || 0) + 1;
        });

        // Trier les tokens par fréquence décroissante et garder les 30 premiers
        var sortedTokens = Object.keys(count).sort(function(a, b) {
            return count[b] - count[a]; //tri en ordre décroissant de fréquence
        }).slice(0, 30); //on garde les 30 premiers

        // Construire les données pour le graphique
        var chartData = [];
        sortedTokens.forEach(function(token) {
            chartData.push({
                label: token,
                y: count[token]
            });
        });

        // Création du graphique avec CanvasJS
        var chart = new CanvasJS.Chart("chartContainer", { // "chartContainer" doit être un <div> dans HTML
            animationEnabled: true,
            backgroundColor: "transparent",
            title: {
                text: "Mots les plus fréquents"
            },
            data: [{
                type: "pie",
                showInLegend: true,
                legendText: "{label}",
                indexLabelFontSize: 14,
                indexLabel: "{label} - {y}",
                dataPoints: chartData
            }]
        });

        // Affichage du graphique
        chart.render();
    }
}



// Mode Matrix ---------------------------------------------------------------------
function matrixify() {
    // Récupère le texte affiché dans la zone 'fileDisplayArea' (texte issu du fichier chargé)
    const text = document.getElementById("fileDisplayArea").innerText;

    // Remplace tout le contenu du body par deux divs :
    // - introMatrix pour le message d'intro
    // - matrixZone qui contiendra l'effet lettre par lettre (masqué au début)
    document.body.innerHTML = `
        <div id="introMatrix">La matrice est universelle...</div>
        <div id="matrixZone" style="display: none;"></div>
    `;

    // Applique la classe CSS "matrix-mode" au <body>, pour changer le fond et le style texte
    document.body.classList.add("matrix-mode");

    // Récupère la div qui affichera le texte (après l'intro)
    const container = document.getElementById("matrixZone");

    // Récupère la div contenant le message d'intro temporaire
    const intro = document.getElementById("introMatrix");

    // Initialise l’index qui servira à lire chaque lettre du texte une par une
    let i = 0;

    // Fonction récursive qui ajoute les lettres une à une dans la zone d'affichage
    function typeNext() {
        // Tant qu’il reste des lettres à écrire
        if (i < text.length) {
            // Crée un <span> pour chaque lettre
            const span = document.createElement("span");
            span.textContent = text[i]; // Ajoute la lettre actuelle
            container.appendChild(span); // Affiche la lettre dans la page
            i++; // Passe à la lettre suivante

            // Attendre un court délai avant d’écrire la suivante (vitesse aléatoire pour un effet dynamique)
            setTimeout(typeNext, Math.random() * 50 + 15);
        }
    }

    // Attendre 2 secondes avant de supprimer le message d’intro et démarrer l’animation
    setTimeout(() => {
        intro.remove(); // Supprime le message "La matrice est universelle..."
        container.style.display = "block"; // Affiche la zone où les lettres vont s’écrire
        typeNext(); // Démarre l’écriture lettre par lettre
    }, 2000);
}
