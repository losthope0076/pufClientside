// let consolenlog = false;
let consolenlog = false;

function cerr(text){
    if(consolenlog){
        console.error(text);
    }
}
function cbug(text){
    if(consolenlog){
        console.warn(text);
    }
}
function clog(text){
    if(consolenlog){
        console.log(text);
    }
}

Vue.component('formateMyDate',{
    props:['date'],
    template:'<span>{{ dateformat }}</span>',
    computed:{
        dateformat: function () {
            try {
                let date = this.date.split('T');
                let date1 = date[0].split('-');
                return date1[2] + '-' + date1[1] + '-' + date1[0] + ' ' + date[1].slice(0, 5);
            }catch (e) {
                return 'unbekannt';
            }
        }
    }
});

Vue.component('raeume',{
    props: ['raeume'],
    template:
    '<table>\n' +
        '<tr>\n' +
        '<td>Id</td>\n' +
        '<td>Adresse</td>\n' +
        '<td>Hausnummer</td>\n' +
        '<td>Plz</td>\n' +
        '<td>Stadt</td>\n' +
        '<td>Zimmer</td>\n' +
    '</tr>\n' +
    '<tr v-for="raum in raeume">\n' +
        '<td>{{ raum.id }}</td>\n' +
        '<td>{{ raum.adresse }}</td>\n' +
        '<td>{{ raum.hausnummer }}</td>\n' +
        '<td>{{ raum.plz }}</td>\n' +
        '<td>{{ raum.stadt }}</td>\n' +
        '<td>{{ raum.zimmer }}</td>\n' +
        '</tr>\n' +
    '</table>'
});
Vue.component('beitragsuebersicht', {
    props: ['beitragsuebersicht', 'isadminsite'],
    template: '' +
    '<table v-if="beitragsuebersicht != null">\n' +
        '<tr>\n' +
            '<th v-if="isadminsite">Id</th>\n' +
            '<th>Betrag</th>\n' +
            '<th v-if="isadminsite">Einzahler</th>\n' +
            '<th>Kommentar</th>\n' +
            '<th>Datum</th>\n' +
            '<th v-if="isadminsite"></th>\n' +
        '</tr>\n' +
        '<tr v-for="beitrag in beitragsuebersicht">\n' +
            '<td v-if="isadminsite">{{ beitrag.id }}</td>\n' +
            '<td>{{ beitrag.betrag }}</td>\n' +
            '<td v-if="isadminsite">{{ beitrag.einzahler.vorname }} - {{ beitrag.einzahler.nachname }}</td>\n' +
            '<td>{{ beitrag.kommentar }}</td>\n' +
            '<td> <formate-my-date :date="beitrag.datum"></formate-my-date></td>\n' +
            '<td v-if="isadminsite"><img @click="$emit(\'delentry\', \'beitrag\', beitrag.id)" src="img/delete.png"></td>' +
        '</tr>\n' +
    '</table>'

});
Vue.component('beitragerstellen',{
    props: ['beitrag','mitglieder'],
    data:function(){
        return{
            valid: false,
        }
    },
    methods:{
        /**
         * Ueberprueft ob die EIngaben Korrekt sind
         */
        checkvalidate: function () {
            let isvalid = true;
            if(!this.beitrag.betrag.match("^(([0-9][\\d]*)((.|,)[\\d]+|))|$")){
                clog('beitrag ist falsch');
                isvalid = false;
            }
            if(this.beitrag.einzahler === ""){
                isvalid = false;
            }
            clog(JSON.stringify(this.beitrag.einzahler));

            this.valid = isvalid;

        }
    },
    template: '' +
        '<section>\n'+
            '<h3>Beitrag zunhufuehgen</h3>\n'+
            '<label>betrag</label>\n'+
            '<input type="text" v-model="beitrag.betrag" pattern="^(([0-9][\\d]*)((.|,)[\\d]+|))|$" @blur="checkvalidate"><br>\n'+
            '<label>kommentar</label>\n'+
            '<input type="text" v-model="beitrag.kommentar"><br>\n'+

            '<label>einzahler</label>\n'+
            '<select v-model="beitrag.einzahler" required @blur="checkvalidate">\n'+
                '<option v-for="mitglied in mitglieder" :value="mitglied">{{ mitglied.vorname }} - {{ mitglied.nachname }}</option>\n'+
            '</select>\n<br>'+
            '<div>' +
                '<button v-if="valid" @click="$emit(\'insertentry\',\'beitrag\', beitrag)">Erstellen</button>\n'+
                '<button v-else disabled>Erstellen</button>\n'+
            '</div>' +
        '</section>'
});

Vue.component('mitgliedErstellen', {
    props: ['mitglied', 'isadminsite', 'cssClass', 'user'],
    data: function () {
        return {
            valid: false
        }
    },
    methods: {
        /**
         * Wandelt ein Bild als dataurl Um
         * @param file
         */
        setimagedate(file) {
            clog(file);
            clog(file.target.files);
            if(file.target.files[0].size <= 5000000) {
                let input = file.target;
                let reader = new FileReader();
                let user = this.mitglied;
                reader.onload = function () {
                    // document.getElementById('registerImage').src = reader.result;
                    clog(reader.result);
                    user.bild = reader.result;
                };
                reader.readAsDataURL(input.files[0]);
            }else{
                document.getElementById("image").value = "";
                clog(document.getElementById("image"));
                alert("Diese Datei ist Groesser 5 MB")
            }
        },
        /**
         * Ueberprueft ob die EIngaben Korrekt sind
         */
        checkvalidate(){
            let isvalid = true;
            let hans = document.getElementsByTagName('input');

            for (let i = 0; i < 8; i++) {
                let entry = hans[i];

                clog(entry.placeholder);

                if(entry.value.match(entry.pattern)){
                    clog('valide');
                }else {
                    isvalid = false;
                    clog('invalide');
                }
            }
            clog(isvalid);
            this.valid = isvalid;
        }
    },
    template:
    '<section> \n' +
        '<h3 v-if="mitglied.id">Mitglied Bearbeiten</h3>' +
        '<h3 v-else>Mitglied erstellen</h3>' +
        '<div class="PersoneneEingabe"> \n' +
            '<label>Vorname</label>\n' +
            '<input type="text" v-model="mitglied.vorname" placeholder="vorname" pattern="^[a-zäöüßA-ZÄÖÜ]{3,}$" @blur="checkvalidate()" ><br>\n' +
            '<label>Nachname</label>\n' +
            '<input type="text" v-model="mitglied.nachname" placeholder="nachname" pattern="^[a-zäöüßA-ZÄÖÜ]{3,}$" @blur="checkvalidate()"><br>\n' +
            '<label>Plz</label>\n' +
            '<input name="plz" type="text" v-model="mitglied.plz" placeholder="plz" pattern="^[0-9]{5}$" @blur="checkvalidate()"><br>\n' +
            '<label>Stadt</label>\n' +
            '<input name="stadt" type="text" v-model="mitglied.stadt" placeholder="stadt" pattern="^[a-zäöüßA-ZÄÖÜ]{3,}$" @blur="checkvalidate()"><br>\n' +
            '<label>Adresse</label>\n' +
            '<input name="adresse" type="text" v-model="mitglied.adresse" placeholder="adresse" @blur="checkvalidate()" pattern="^([a-zäöüßA-ZÄÖÜ]{4})(([a-zäöüßA-ZÄÖÜ\\-\\s]*)([a-zäöüßA-ZÄÖÜ]{3}))+(\\.|)$"><br>\n' +
            '<label>Hausnummer</label>\n' +
            '<input name="hausnummer" type="text" v-model="mitglied.hausnummer" placeholder="hausnummer" @blur="checkvalidate()" pattern="^([0-9].*)$"><br>\n' +
            '<div v-if="mitglied.id.length == 0">' +
                '<label>Username</label>\n' +
                '<input type="text" v-model="mitglied.username" placeholder="Benutzername" @blur="checkvalidate()" pattern="^[\\w]{5,}$" ><br>\n' +
            '</div>' +
            '<label>Passwort</label>\n' +
            '<input type="text" v-model="mitglied.password" placeholder="Passwort" @blur="checkvalidate()" pattern="^[\\w]{5,}$"><br>\n' +
            '<label>Profilbild Max 5MB</label>\n' +
            '<input id="image" name="files" type="file" @change="setimagedate($event)" @blur="checkvalidate()" accept="image/*">' +


        '<div v-if="this.valid">' +
                '<button v-if="mitglied.id" @click="$emit(\'editentry\',\'mitglied\',mitglied)">Bearbeiten</button>' +
                // '<button v-else-if="isadminsite" @click="$emit(\'insertentry\',\'adminmitglied\',mitglied)">Registrieren</button>' +
                '<button v-else @click="$emit(\'insertentry\',\'mitglied\',mitglied)">Registrieren</button>' +
            '</div>'+
        '<div v-else>' +
                '<button v-if="mitglied.id" @click="$emit(\'editentry\',\'mitglied\',mitglied)" disabled>Bearbeiten</button>' +
                // '<button v-else-if="isadminsite" @click="$emit(\'insertentry\',\'adminmitglied\',mitglied)">Registrieren</button>' +
                '<button v-else @click="$emit(\'insertentry\',\'mitglied\',mitglied)" disabled>Registrieren</button>' +
            '</div>' +
        '</div>' +
        '<div class="ProfilBild" v-if="mitglied.bild">' +
            '<img alt="" :src="mitglied.bild" id="registerImage" width="200px" height="200px"><br>' +
            '<button @click="$emit(\'deleteimage\')">Bild Loeschen</button>' +
        '</div>' +
        '' +
        '<div v-if="isadminsite">' +
            '<h3>Rolle Aendern</h3>' +
            '<select v-model="mitglied.role">\n'+
                '<option value="Unregistriert">Unregistriert</option>\n'+
                '<option value="Registriert">Registriert</option>\n'+
                '<option value="ADMIN">ADMIN</option>\n'+
            '</select>\n<br>'+
            '<button @click="$emit(\'changememberrole\',mitglied.id,mitglied.role)">Rolle Aendern</button>' +
        '</div>' +
    '</section>',
});
Vue.component('mitglieder', {
    props: ['mitglieder', 'user', 'isadminsite'],
    template:
    '<table>\n' +
        '<tr>\n' +
            '<th v-if="isadminsite">id</th>\n' +
            '<th>Vorname</th>\n' +
            '<th>Nachname</th>\n' +
            '<th>Typ</th>\n' +
            '<th>Registriert</th>\n' +
            '<th v-if="isadminsite">Plz</th>\n' +
            '<th v-if="isadminsite">Stadt</th>\n' +
            '<th v-if="isadminsite">Adresse</th>\n' +
            '<th v-if="isadminsite">Hausnummer</th>\n' +
            '<th v-if="isadminsite">Bearbeiten</th>\n' +
            '<th v-if="isadminsite">Loeschen</th>\n' +
        '</tr>\n' +
        '<tr v-for="mitglied in mitglieder">\n' +
            '<td v-if="isadminsite">{{ mitglied.id }}</td>\n' +
            '<td v-if="isadminsite"><a href="#" @click="$emit(\'getmitglied\',mitglied.id, true)"> {{ mitglied.vorname }}</a></td>\n' +
            '<td v-else><a href="#" @click="$emit(\'getmitglied\',mitglied.id)"> {{ mitglied.vorname }}</a></td>\n' +
            '<td>{{ mitglied.nachname }}</td>\n' +
            '<td>{{ (mitglied.role) }}</td>\n' +
            '<td><formateMyDate :date="mitglied.registriert"></formateMyDate></td>\n' +
            '<td v-if="isadminsite">{{ mitglied.plz }}</td>' +
            '<td v-if="isadminsite">{{ mitglied.stadt }}</td>' +
            '<td v-if="isadminsite">{{ mitglied.adresse }}</td>' +
            '<td v-if="isadminsite">{{ mitglied.hausnummer }}</td>' +
            '<td v-if="isadminsite"><img @click="$emit(\'loadeditentry\',\'mitglied\',mitglied)" src="img/edit.png"></td>' +
            '<td v-if="isadminsite"><img @click="$emit(\'delentry\',\'mitglied\' ,mitglied.id)" src="img/delete.png"></td>' +
        '</tr>\n' +
    '</table>'
});
Vue.component('mitglied', {
    props: ['mitglied', 'isadminsite'],
    template:
        '<section>' +
             '<section>' +
                '<h3>PersonenUebersicht</h3>' +
                '<section>' +
                    '<dL>\n' +
                        '<dt v-if="isadminsite">Id</dt>\n' +
                        '<dd v-if="isadminsite">{{ mitglied.id }}</dd>\n' +
                        '<dt>Vorname</dt>\n' +
                        '<dd>{{ mitglied.vorname }}</dd>\n' +
                        '<dt>Nachname</dt>\n' +
                        '<dd>{{ mitglied.nachname }}</dd>\n' +
                        '<dt>Rolle</dt>\n' +
                        '<dd>{{ mitglied.role }}</dd>\n' +
                        '<dt>Geaendert</dt>\n' +
                        '<dd><formate-my-date :date="mitglied.geaendert"></formate-my-date></dd>\n' +
                        '<dt>Registriert</dt>\n' +
                        '<dd><formate-my-date :date="mitglied.registriert"></formate-my-date></dd>\n' +
                        '<dt>Adresse</dt>\n' +
                        '<dd>{{ mitglied.adresse }}</dd>\n' +
                        '<dt>Hausnummer</dt>\n' +
                        '<dd>{{ mitglied.hausnummer }}</dd>\n' +
                        '<dt>Plz</dt>\n' +
                        '<dd>{{ mitglied.plz }}</dd>\n' +
                        '<dt>Stadt</dt>\n' +
                        '<dd>{{ mitglied.stadt }}</dd>\n' +
                    '</dL>\n' +
                '</section>' +
                '<section>' +
                    '<img :src="mitglied.bild" id="registerImage" width="200px" height="200px" v-if="mitglied.bild">' +
                '</section>' +
            '</section>' +
        '</section>',
});

Vue.component('nachrichten', {
    props: ['nachrichten', 'user', 'isadminsite'],
    template:
    '<div>' +
        '<table v-if="isadminsite">\n' +
            '<tr>\n' +
                '<th>Id</th>\n' +
                '<th>Erstellt_am</th>\n' +
                '<th>Inhalt</th>\n' +
                '<th>Titel</th>\n' +
                '<th>Rrsteller</th>\n' +
                '<th>Anzeigen</th>\n' +
                '<th></th>\n' +
                '<th></th>\n' +
            '</tr>\n' +
            '<tr v-for="nachricht in nachrichten">\n' +
                '<td>{{ nachricht.id }}</td>\n' +
                '<td><formateMyDate :date="nachricht.erstellt"></formateMyDate></td>\n' +
                '<td>{{ nachricht.inhalt }}</td>\n' +
                '<td>{{ nachricht.titel }}</td>\n' +
                '<td>{{ nachricht.ersteller.vorname }} - {{ nachricht.ersteller.nachname }}</td>\n' +
                '<td v-if="isadminsite && nachricht.sichtbarkeit == true">JA</td>' +
                '<td v-if="isadminsite && nachricht.sichtbarkeit == false">Nein</td>' +
                '<td v-if="isadminsite"><img @click="$emit(\'loadeditentry\', \'nachricht\' ,nachricht)" src="img/edit.png"></td>' +
                '<td v-if="isadminsite"><img @click="$emit(\'delentry\',\'nachricht\' ,nachricht.id)" src="img/delete.png"></td>' +
            '</tr>\n' +
        '</table>' +
        '<div v-else>' +
            '<div v-for="nachricht in nachrichten" class="news">' +
                '<div class="top"><h2>{{ nachricht.titel }}</h2></div>' +
                '<div class="mid newsInhalt">{{ nachricht.inhalt }}</div>' +
                // '<div class="bot">geschrieben von {{ nachricht.ersteller.vorname }} - {{ nachricht.ersteller.nachname }} am <formateMyDate :date="nachricht.erstellt"></formateMyDate></div>' +
                '<div class="bot">Geschrieben: <formateMyDate :date="nachricht.erstellt"></formateMyDate></div>' +
            '</div>' +
        '</div>' +
    '</div>',
});
Vue.component('nachrichtErstellen',{
    props: ['nachricht', 'user', 'mitglieder'],
    data: function(){
        return{
            valid: false
        }
    },
    methods:{
        /**
         * Ueberprueft ob die EIngaben Korrekt sind
         */
        checkvalidate: function () {
            let isvalid = true;

            let entries = document.getElementsByClassName('entry');

            if(!entries[0].value.match(entries[0].pattern)){
                isvalid = false;
                clog('erster Eintrag Falsch')
            }
            if(!entries[1].value.match("^[a-zA-Z0-9]{3,}([\\r\\n]*.*)*$")){
                isvalid = false;
                clog('Text Area ist falsch')
            }
            clog(entries[1].value);
            clog(this.valid);
            clog(isvalid);
            this.valid = isvalid;
        },
    },
    template: '' +
    '<section>' +
        '<h2 v-if="nachricht.id">Nachricht Bearbeiten</h2>\n' +
        '<h2 v-else>Nachricht erstellen</h2>\n' +
        '<label>Titel</label>\n' +
        '<input class="entry" name="titel" type="text" v-model="nachricht.titel" placeholder="titel" pattern="(\\w{4,}.*[0-9A-Za-z]+)" @blur="checkvalidate"><br>\n' +
        '<label>Inhalt</label>\n' +
        '<textarea class="entry" rows="4" cols="20" v-model="nachricht.inhalt" @blur="checkvalidate"></textarea><br>\n' +
        '<label>Ersteller</label>\n' +
        // '{{ mitglieder }}' +
        '<select v-model="nachricht.ersteller" v-if="nachricht.id" title="ersteller">\n' +
            '<option v-for="val in mitglieder" v-bind:value="val" :selected="val.id == nachricht.ersteller.id">\n' +
                '{{ val.vorname }} - {{ val.nachname}}\n' +
            '</option>\n' +
        '</select>\n' +
        '<input v-else type="text" value="" v-model="user.vorname" placeholder="ersteller" disabled><br>\n' +
        '<label>Sichtbarkeit</label>\n' +
        '<input v-model="nachricht.sichtbarkeit" type="checkbox" title="status">Anzeigen<br>\n' +
        '<div v-if="this.valid">' +
            '<button v-if="nachricht.id" @click="$emit(\'editentry\',\'nachricht\', nachricht)">Bearbeiten</button>' +
            '<button v-else @click="$emit(\'insertentry\', \'nachricht\', nachricht)">Erstellen</button>' +
        '</div>' +
        '<div v-else>' +
            '<button v-if="nachricht.id" disabled>Bearbeiten</button>' +
            '<button v-else disabled>Erstellen</button>' +
        '</div>' +

    '</section>'
});

Vue.component('veranstalltung', {
    props: ['veranstalltung', 'user', 'isadminsite'],
    computed:{
        /**
         * Ersetzt den . Beim Preis durch ein ,
         * @returns {string}
         */
        setMoney(){
            return this.veranstalltung.kosten.toString().replace(".",",")
        }
    },
    template:
    '<div v-if="veranstalltung">' +
        '<section>' +
            '<h3>Veranstalltung</h3>' +
            '<dl>\n' +
                '<dt>Beschreibung</dt>\n' +
                '<dd>{{ veranstalltung.beschreibung }}  {{ veranstalltung.id }}  </dd>\n' +
                '<dt>Datum</dt>\n' +
                '<dd><formate-my-date :date="veranstalltung.datum"></formate-my-date></dd>\n' +
                '<dt>Dauer</dt>\n' +
                '<dd>{{ veranstalltung.dauer }}</dd>\n' +
                '<dt>Kosten</dt>\n' +
                '<dd>{{ setMoney }}$</dd>\n' +
                '<dt>Name</dt>\n' +
                '<dd>{{ veranstalltung.name }}</dd>\n' +
                '<dt>Teilnehmerzahl</dt>\n' +
                '<dd>{{ veranstalltung.teilnehmerzahl }}</dd>\n' +
                '<dt>Teilnehmer</dt>\n' +
                '<dd v-if="veranstalltung.mitglied != null">{{ veranstalltung.mitglied.length }}</dd>\n' +
                '<dd v-else>0</dd>\n' +
            '</dl>' +
        '</section>' +

        '<section v-if="veranstalltung.leitung">' +
            '<h3>Leitung</h3>' +
            '<dl>' +
                '<dt>Leiter</dt>' +
                '<dd>{{ veranstalltung.leitung.aufseher }}</dd>' +
                '<dt>Organisation</dt>' +
                '<dd>{{ veranstalltung.leitung.organisation }}</dd>' +
                '<dt>Bemerkung</dt>' +
                '<dd>{{ veranstalltung.leitung.bemerkung }}</dd>' +
            '</dl>' +
        '</section>' +

        '<section v-if="veranstalltung.raum">' +
            '<h3>Veranstalltungsraum</h3>' +
            '<dl>' +
                '<dt>Adresse</dt>' +
                '<dd>{{ veranstalltung.raum.adresse }} {{ veranstalltung.raum.hausnummer }}</dd>' +
                '<dd>{{ veranstalltung.raum.plz }} {{ veranstalltung.raum.stadt }}</dd>' +
                '<dd>{{ veranstalltung.raum.zimmer }}</dd>' +
            '</dl>' +
        '</section>' +

        '<section v-if="veranstalltung.typ">' +
            '<h3>Veranstalltungstyp</h3>' +
            '<dl>' +
                '<dt>Typ</dt>' +
                '<dd>{{ veranstalltung.typ.name }}</dd>' +
                '<dt v-if="veranstalltung.typ.beschreibung">Beschreibung</dt>' +
                '<dd v-if="veranstalltung.typ.beschreibung">{{ veranstalltung.typ.beschreibung }}</dd>' +
            '</dl>' +
        '</section>' +

        '<section>' +
            '<h3>Teilnehmer</h3>' +
            '<ul>' +
                '<li v-if="veranstalltung.mitglied == null || veranstalltung.mitglied.length == 0">Keine Anmeldungen</li>' +
                '<li v-for="mitglied in veranstalltung.mitglied">' +
                    '<a :href="\'#mitglied\'" @click="$emit(\'getmitglied\', mitglied.id)">' +
                        '{{ mitglied.vorname }} {{ mitglied.nachname }}' +
                    '</a>' +
                        '<img v-if="isadminsite" src="img/delete.png" alt="Delete Image" @click="$emit(\'remuserfromentry\', veranstalltung.id, mitglied.id)">' +
                '</li>' +
            '</ul>' +

        '</section>' +

        '<section class="anmelden" v-if="!isadminsite">' +
            '<div v-if="user.veranstalltungsIds.includes(parseInt(veranstalltung.id))">\n' +
                '<button class="anmelden"  v-on:click="$emit(\'rementry\',\'veranstalltung\', veranstalltung.id)" style="background: orangered">Abmelden</button>\n' +
            '</div>\n' +
            '<div v-else-if="user.role == \'Unregistriert\'">\n' +
                '<button class="anmelden" style="background: grey: color: #ffffff;" disabled>Anmelden</button>\n' +
            '</div>\n' +
            '<div v-else-if="veranstalltung.mitglied == null || veranstalltung.teilnehmerzahl > veranstalltung.mitglied.length">\n' +
                '<button class="anmelden" v-on:click="$emit(\'addentry\',\'veranstalltung\', veranstalltung.id)" style="background: greenyellow">Anmelden</button>\n' +
            '</div>\n' +
            '<div class="anmelden" v-else>\n' +
                '<button class="anmelden" disabled>VOLL</button>\n' +
            '</div>\n' +
        '</section>' +
        '<section v-else>' +
        '</section>' +
    '</div>'
});
Vue.component('veranstalltungen', {
    props: ['veranstalltungen', 'user', 'isadminsite'],
    template:
    '<table v-if="veranstalltungen != null && veranstalltungen.length > 0">\n' +
        '<tr>\n' +
            '<th v-if="isadminsite">id</th>\n' +
            '<th>Name</th>\n' +
            '<th>Beschreibung</th>\n' +
            '<th>Veranstalltungsart</th>\n' +
            '<th>Datum</th>\n' +
            '<th>Dauer</th>\n' +
            '<th>Kosten</th>\n' +
            '<th>Plaetze</th>\n' +
            '<th>Leitung</th>\n' +
            '<th v-if="isadminsite">Aktion</th>\n' +
        '</tr>\n' +
        // '<tr v-if=""  v-for="veranstalltung in veranstalltungen">\n' +
        '<tr v-for="veranstalltung in veranstalltungen">\n' +
            '<td v-if="isadminsite">{{ veranstalltung.id }}</td>\n' +
        '<td>' +
            '<a :href="\'#Veranstalltung\'" v-on:click="$emit(\'getveranstalltung\', veranstalltung.id, isadminsite)">\n' +
            '{{ veranstalltung.name }}</a>\n' +
        '</td>\n' +

            '<td>{{ veranstalltung.beschreibung }}</td>\n' +
        '<td v-if="veranstalltung.typ">{{ veranstalltung.typ.name }}</td>\n' +
        '<td v-else>{{ veranstalltung.veranstalltungstyp }}</td>\n' +
            // '<td>{{ this.formatMyDate(veranstalltung.datum) }}</td>\n' +
            '<td><formate-my-date :date="veranstalltung.datum"></formate-my-date></td>\n' +
            '<td>{{ veranstalltung.dauer }}</td>\n' +
            '<td>{{ veranstalltung.kosten.toString().replace(".",",") }}$</td>\n' +
            '<td>{{ veranstalltung.teilnehmerzahl }}</td>\n' +
            '<td v-if="veranstalltung.leitung">{{ veranstalltung.leitung.aufseher }}</td>\n' +
            '<td v-else>{{ veranstalltung.leitungsname }}</td>\n' +
            // '<td  v-if="isadminsite"><img @click="this.$parent(\'delentry\',\'veranstalltung\' , veranstalltung.id)" src="img/delete.png"></td>\n' +
            '<td  v-if="isadminsite"><img @click="$emit(\'delentry\',\'veranstalltung\' , veranstalltung.id)" src="img/delete.png"></td>\n' +
        '</tr>\n' +
    '</table>'
});
Vue.component('veranstalltungerstellen',{
    props: ['veranstalltung','raeume','veranstalltungstypen','leitungen','dateformat','raum','veranstalltungstyp','leitung'],
    data: function () {
        return {
            showroom: 0,
            showtyp: 0,
            showleitung: 0,
            valid: false
        }
    },
    methods:{

        /**
         * Ueberprueft die Eingegebenen Werte auf Korrektheit
         */

        checkvalidate() {
            let isvalid = true;

            let ver = document.getElementsByClassName('ver');
            clog(ver);
            let add = document.getElementsByClassName('add');
            clog(add);
            let typ = document.getElementsByClassName('typ');
            clog(typ);
            let auf = document.getElementsByClassName('auf');
            clog(auf);


            for (let items of ver) {
                clog(items.value);

                if (items.name == 'datum' || items.name == 'Uhrzeit') break;

                if (items.value.match(items.pattern)) {
                    clog('valide');
                } else {
                    isvalid = false;
                    break;
                    clog('invalide');
                }

            }

            // let items;

            clog(this.veranstalltung);
            clog(this.veranstalltung.raum);
            clog(this.veranstalltung.length);
            /**
             * Schaut ob ein Raum ausgewaehtl worde oder ueberprueft ob die Eingegebenen Daten Korrekt sind
             */
            if(this.veranstalltung.raum === ""){
                isvalid = false;
                clog('raum nicht gesetzt')
            }else if(this.veranstalltung.raum === "0"){
                clog('neuer Ort wird gesetzt');
                for (let items of add) {
                    clog(items + ': ');
                    if (items.value.match(items.pattern)) {
                        clog('valide');
                    } else {
                        isvalid = false;
                        clog('invalide');
                    }
                }
            }
            /**
             * Schaut ob ein Veranstalltungstyp ausgewaehtl worde oder ueberprueft ob die Eingegebenen Daten Korrekt sind
             */
            if(this.veranstalltung.typ === ""){
                isvalid = false;
                clog('typ nicht gesetzt')
            }else if(this.veranstalltung.typ === "0"){
                clog('neuer typ wird gesetzt');
                for (let items of typ) {
                    clog(items + ': ');
                    if (items.value.match(items.pattern)) {
                        clog('valide');
                    } else {
                        isvalid = false;
                        clog('invalide');
                    }
                }
            }


            /**
             * Schaut ob eine Leitung ausgewaehtl worde oder ueberprueft ob die Eingegebenen Daten Korrekt sind
             */
            if(this.veranstalltung.leitung === ""){
                isvalid = false;
                clog('typ nicht gesetzt')
            }else if(this.veranstalltung.leitung === "0"){
                clog('neuer typ wird gesetzt');
                for (let items of auf) {
                    clog(items + ': ');
                    if (items.value.match(items.pattern)) {
                        clog('valide');
                    } else {
                        isvalid = false;
                        clog('invalide');
                    }
                }
            }

            if(this.dateformat.date == "" || this.dateformat.date == null){
                isvalid = false;
            }
            if(this.dateformat.time == "" || this.dateformat.time == null){
                isvalid = false;
            }

            clog(isvalid);
            this.valid = isvalid;
        },


        /**
         * Jetzt alle Eintraege eines Raumes als String zusammen
         * @param {Object} raum
         * @returns {string} Alle ausgaben des Raums
         */
        raumEntries: function(raum) {
            return raum.adresse + ' ' + raum.hausnummer + ' ' + raum.plz + ' ' + raum.stadt + ' ' + raum.zimmer;
        },

        /**
         * Zeigt wenn neue Eingabe erfolgen soll die Felder zum erstellen eines Raumes
         * Sonst bleiben die Felder ausgeblendet
         */
        changeShowRoom(){
            clog('changeShowRoom');
            clog(this.veranstalltung.raum);
            this.showroom = ((this.veranstalltung.raum == 0 && this.veranstalltung.raum != "" )?1:0);
        },
        /**
         * Zeigt wenn neue Eingabe erfolgen soll die Felder zum erstellen eines Typs
         * Sonst bleiben die Felder ausgeblendet
         */
        changeShowTyp(){
            clog('changeShowTyp');
            this.showtyp = ((this.veranstalltung.typ == 0 && this.veranstalltung.typ != "")?1:0);
        },
        /**
         * Zeigt wenn neue Eingabe erfolgen soll die Felder zum erstellen einer neuen Leitung
         * Sonst bleiben die Felder ausgeblendet
         */
        changeShowLeitung(){
            clog('changeShowLeitung');
            this.showleitung = ((this.veranstalltung.leitung == 0 && this.veranstalltung.leitung != "")?1:0);
        }
    },
    template:
    '<div>' +
        '<label>Name</label>\n' +
        '<input class="ver" name="name" type="text" v-model="veranstalltung.name" placeholder="name" @blur="checkvalidate()" pattern="^[a-zäöüßA-ZÄÖÜ0-9]{2,}$"><br>\n' +
        '<label>Beschreibung</label>\n' +
        '<input class="ver" name="beschreibung" type="text" v-model="veranstalltung.beschreibung" placeholder="beschreibung" @blur="checkvalidate()" pattern="^(.*)$"><br>\n' +
        '<label>Dauer in Minuten</label>\n' +
        '<input class="ver" name="dauer" type="text" v-model="veranstalltung.dauer" placeholder="dauer" @blur="checkvalidate()" pattern="^([0-9]{1,}|)$" ><br>\n' +
        '<label>Kosten</label>\n' +
        '<input class="ver" name="kosten" type="text" v-model="veranstalltung.kosten" placeholder="kosten" @blur="checkvalidate()" pattern="^([1-9][0-9]*)(((,|.)[0-9]{0,2})?)||0$"><br>\n' +
        '<label>Teilnehmerzahl</label>\n' +
        '<input class="ver" name="teilnehmerzahl" type="text" v-model="veranstalltung.teilnehmerzahl" @blur="checkvalidate()" placeholder="teilnehmerzahl"><br>\n' +
        '<label>Datum</label>\n' +
        '<input class="ver" name="datum" type="date" v-model="dateformat.date" placeholder="datum" @blur="checkvalidate()" ><br>\n' +
        '<label>Uhrzeit</label>\n' +
        '<input class="ver" name="Uhrzeit" type="time" v-model="dateformat.time" placeholder="datum" @blur="checkvalidate()" ><br>\n' +
        '<label>Raum</label>\n' +
        '<select class="ver" v-model="veranstalltung.raum" title="raum" @click="changeShowRoom()" @blur="checkvalidate()" >\n' +
            '<option value="0" >Neuer Ort</option>\n' +
            '<option v-for="raum in raeume" :value="raum">\n' +
            '{{ raumEntries(raum) }}\n' +
            '</option>\n' +
        '</select>\n' +
        '<br>\n' +
        '<div v-if="showroom === 1">\n' +
            '<h3>Ort erstellen</h3>\n' +
            '<label>Adresse</label>\n' +
            '<input class="add"  name="adresse" type="text" v-model="raum.adresse" @blur="checkvalidate()" pattern="^([a-zäöüßA-ZÄÖÜ]{4})(([a-zäöüßA-ZÄÖÜ\\-\\s]*)([a-zäöüßA-ZÄÖÜ]{4}))+$"><br>\n' +
            '<label>Hausnummer</label>\n' +
            '<input class="add" name="hausnummer" type="text" v-model="raum.hausnummer" @blur="checkvalidate()" pattern="^([0-9].*)$"><br>\n' +
            '<label>Plz</label>\n' +
            '<input class="add" name="plz" type="text" v-model="raum.plz" @blur="checkvalidate()" pattern="^[0-9]{5}$"><br>\n' +
            '<label>Stadt</label>\n' +
            '<input class="add" name="stadt" type="text" v-model="raum.stadt" @blur="checkvalidate()" pattern="^[a-zäöüßA-ZÄÖÜ\\-\\s]{3,}$"><br>\n' +
            '<label>Zimmer</label>\n' +
            '<input class="add" name="zimmer" type="text" v-model="raum.zimmer"><br>\n' +
        '</div>\n' +

        '<label>Typ</label>\n' +
            '<select class="ver" v-model="veranstalltung.typ" title="typ" @click="changeShowTyp()" @blur="checkvalidate()">\n' +
            '<option value="0">Neuer Veranstalltungstyp</option>\n' +
            '<option v-for="typ in veranstalltungstypen" :value="typ">\n' +
            '{{ typ.name }}\n' +
            '</option>\n' +
        '</select>\n' +
        '<br>\n' +

        '<div v-if="showtyp === 1">\n' +
            '<h3>Veranstalltungstyp erstellen</h3>\n' +
            '<label>Name</label>\n' +
            '<input class="typ" name="name" type="text" v-model="veranstalltungstyp.name" placeholder="name" @blur="checkvalidate()" pattern="^[a-zäöüßA-ZÄÖÜ\\-\\s]{3,}$"><br>\n' +
            '<label>Beschreibung</label>\n' +
            '<input class="typ" name="beschreibung" type="text" v-model="veranstalltungstyp.beschreibung" placeholder="beschreibung"><br>\n' +
        '</div>\n' +

        '<label>Leitung</label>\n' +
        '<select class="ver" v-model="veranstalltung.leitung" title="Leitung" @click="changeShowLeitung()"  @blur="checkvalidate()">\n' +
            '<option value="0">Neuer leiter</option>\n' +
            '<option v-for="leiter in leitungen" :value="leiter" @blur="checkvalidate()">\n' +
            '{{ leiter.aufseher }} - {{ leiter.organisation }}\n' +
            '</option>\n' +
        '</select>\n' +
            '<div v-if="showleitung === 1">\n' +
            '<h3>Veranstallter erstellen</h3>\n' +
            '<label>Aufseher</label>\n' +
            '<input class="auf" name="aufseher" type="text" v-model="leitung.aufseher" placeholder="aufseher" @blur="checkvalidate()" pattern="^[a-zäöüßA-ZÄÖÜ]{3,}.*$"><br>\n' +
            '<label>Organisation</label>\n' +
            '<input class="auf" name="organisation" type="text" v-model="leitung.organisation" placeholder="organisation" @blur="checkvalidate()" pattern="^[a-zäöüßA-ZÄÖÜ]{3,}$"><br>\n' +
            '<label>Bemerkung</label>\n' +
            '<input class="auf" name="bemerkung" type="text" v-model="leitung.bemerkung" placeholder="bemerkung"><br>\n' +
        '</div>\n' +
        '<br>\n' +
        '<button v-if="this.valid" @click="$emit(\'insertentry\',\'veranstalltung\', veranstalltung)">Erstellen</button >' +
        '<button v-else @click="$emit(\'insertentry\',\'veranstalltung\', veranstalltung)" disabled>Erstellen</button >' +
    '</div>'

});

new Vue({
    el: '#app',
    data: {
        reloadowndata: false, // neuladen der Seite
        window: 'http://localhost:63343/clientside/layout.htm',
        url: 'http://localhost:8080/', //server Url
        serverConfig: {
            headers: {
                'Content-Type': 'application/json',
                'authorization': null
            },
            responseType: 'text',
        },
        linklist: [
            {text: 'Startseite', href: '#home', src: 'nachrichten'},
            {text: 'Mitgliederuebersicht', href: '#Mitgliederuebersicht', src: 'mitglieder'},
            {text: 'Veranstalltungen', href: '#Veranstalltungen', src: 'veranstalltungen'},
            {text: 'Logout', href: '#Logout', src: 'logout'},
            {text: 'Meine Daten', href: '#My', src: 'user'},
            {text: 'Meine Beitraege', href: '#Beitraege', src: 'meinebeitraege'},
            {text: 'Nachricht', href: '#admin/nachrichten', src: 'admin/nachrichten'},
            {text: 'Mitglied', href: '#admin/mitglieder', src: 'admin/mitglieder'},
            {text: 'Beitragsuebersicht', href: '#admin/beitraege', src: 'admin/beitraege'},
            {text: 'Veranstalltung', href: '#admin/veranstalltungen', src: 'veranstalltungen'},
        ],
        error: null,
        querryList:[],
        /*
         * Da Firefox Probleme mit dem Datetime hat wird beides in einzelnde Teile bei den Veranstalltungen gepseichert
         */
        dateformat:{
            time: null,
            date:null,
        },
        // Welche url muss angeschrieben werden
        serverurl: {
            nachrichten: 'nachricht',
            nachricht: 'nachricht',

            mitglieder: 'mitglied',
            mitglied: 'mitglied',

            veranstalltungen: 'veranstalltung',
            veranstalltung: 'veranstalltung',

            beitraege: 'beitrag',
            meinebeitraege: 'meinebeitraege',
            beitrag: 'beitrag',

            leitungen: 'admin/leitung',
            leitung: 'leitung',

            raeume: 'admin/raum',
            raum: 'raum',

            veranstalltungstypen: 'admin/veranstalltungstyp',
            veranstalltungstyp: 'veranstalltungstyp',
            user: 'my',

            'admin/beitraege': 'admin/beitrag',
            'admin/mitglieder': 'admin/mitglied',
            'admin/mitglied': 'admin/mitglied',
            'admin/nachrichten': 'admin/nachricht',
            'admin/nachrichtersteller' : 'admin/nachrichtersteller',
        },
        // Wo muss die ergebnis der Anfrage gespeichert werden
        path: {
            nachrichten: 'nachrichten',
            nachricht: 'nachricht',
            mitglieder: 'mitglieder',
            mitglied: 'mitglied',
            veranstalltungen: 'veranstalltungen',
            veranstalltung: 'veranstalltung',
            meinebeitraege: 'meinebeitraege',
            beitraege: 'beitraege',
            beitrag: 'beitrag',
            leitungen: 'leitungen',
            leitung: 'leitung',
            raeume: 'raeume',
            raum: 'raum',
            veranstalltungstypen: 'veranstalltungstypen',
            veranstalltungstyp: 'veranstalltungstyp',
            user: 'user',

            'admin/beitraege': 'beitraege',
            'admin/mitglieder': 'mitglieder',
            'admin/mitglied': 'mitglied',
            'admin/nachrichten': 'nachrichten',
            'admin/nachrichtersteller': 'mitglieder',

        },
        //Bestimmen in welches Model der Aktuelle vorgang gespeichert werden muss
        activeVariable: null,
        route: '#home', // Welche HTMl Section soll angezeigt werden
        /*
         *  Start der Entitaeten oder Entitaetssammlungen
         */

        //jwt: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNTQ5MTEyMjEyfQ.RT-k1sgPDLgozBAXIqo86IqX2idIi7N_K0mJViV97YHpP9lebEoDfvNsgh5yOMtKxjKNLwqrjcsHw-JRGeo5aA',
        loginData: {
            "username": null,
            "password": null,
        },
        beitraege: [],
        meinebeitraege: [],
        raeume: [],
        veranstalltungstypen: [],
        mitglieder: [],
        veranstalltungen: [],
        nachrichten: [],
        leitungen: [],
        user: {
            id: '',
            vorname: '',
            nachname: '',
            geaendert: null,
            role: '',
            registriert: null,
            adresse: '',
            hausnummer: '',
            plz: '',
            stadt: '',
            veranstalltungsIds: [],
            bild: null,
        },
        mitglied: {
            id: '',
            vorname: '',
            nachname: '',
            geaendert: '',
            username: '',
            password: '',
            role: '',
            registriert: null,
            adresse: '',
            hausnummer: '',
            plz: '',
            stadt: '',
            bild: null,
        },
        nachricht: {
            id: '',
            inhalt: '',
            sichtbarkeit: '',
            titel: '',
            ersteller: null,
            erstellt_am: null,
        },
        raum: {
            id: '',
            adresse: '',
            hausnummer: '',
            plz: '',
            stadt: '',
            zimmer: '',
        },
        leitung: {
            id: '',
            aufseher: '',
            bemerkung: '',
            organisation: '',
        },
        veranstalltungstyp: {
            id: '',
            beschreibung: '',
            name: '',
        },
        veranstalltung: {
            id: '',
            beschreibung: '',
            datum: '',
            dauer: '',
            kosten: '',
            name: '',
            teilnehmerzahl: '',
            anzahl: '',
            leitung: '',
            raum: '',
            typ: '',
        },
        beitrag: {
            betrag: '',
            einzahler: '',
            datum: '',
            kommentar: '',
        },
    },
    methods: {
        /**
         * Dient zum Laden der Eigenen Daten
         */
        GetMyData() {
            clog('GetMyData');
            this.axiosget('user');
        },
        /**
         * Neuladen der Aktuellen Seite
         * Er Zieht sich ueber die Linkliste die Aktuelle Seite
         * Sollte sie nicht vorhanden sein, wird gesondert ueberprueft welche Seite geladen werden muss
         * @param {Object|int|boolean} [idgegeben = false]
         */
        reloadSite(idgegeben = false) {
            cbug('reloadSite');
            clog('this.route');
            clog(this.route);
            let status =  false;


            let result;
            // Raussuchen des Aktuellen links um die Seite neu aufzurufen
            for (let i = 0; i < this.linklist.length; i++) {
                if (this.linklist[i].href === this.route) {
                    result = this.linklist[i];
                    clog('Item Gefunden');
                    clog(JSON.stringify(this.linklist[i]));
                    this.setRoute(result.src, result.href);
                    status = true;
                }
            }
            // Falls kein EIntrag gefunden worden ist
            if(!status){
                let site = this.route.toLowerCase().replace("#","");
                clog(idgegeben);
                clog(site);
                switch (site) {
                    case 'veranstalltung':
                        this.getVeranstalltung(idgegeben);
                        break;
                    case 'admin/veranstalltung':
                        this.getVeranstalltung(idgegeben,true);
                        break
                }
                clog('site');
                clog(site);
                clog('veranstalltung');
                clog('nicht eingetragen')
            }

        },
        /**
         * Die Funktion zum einloggen
         * es SPeichert den Entgegengenommenen Token in Locale Storrage
         */
        login() {
            clog(JSON.stringify(this.loginData));
            axios.post(
                this.url + 'login',
                JSON.stringify(this.loginData),
                this.serverConfig
            )
                .then(response => {
                    localStorage.setItem('jwt', response.headers.authorization);
                    this.serverConfig.headers.authorization = response.headers.authorization;
                    this.setRoute('user', '#My');

                })
                .catch(error => {
                    switch (error.response.status) {
                        case 401:
                            this.error = "Autoriesierung Fehlgeschlagen"
                            break;
                        default:
                            this.error = "Ein Fehler ist aufgetreten";
                    }
                    clog(error);
                });
        },

        /**
         *
         * Dient zum Richtigen Laden des benoetigten Mitglied
         *
         * @param {int} val das Mitglied, dass geladen werden soll
         * @param {boolean} isadmin soll die Seite als Admin geladen werden
         */
        getmitglied(val, isadmin = false) {
            if(isadmin){
                this.setRoute('mitglied', '#admin/mitglied', val);
            }else {
                this.setRoute('mitglied', '#Mitglied', val);
            }
        },
        /**
         * nimmt das Uebergebe Objekt und gibt es weiter um die ROute der Veranstalltung zu laden
         * @param {int} val die id der Zu ladenden veranstalltung
         * @param {boolean} isadmin soll die Seite als Admin geladen werden
         */
        getVeranstalltung(val, isadmin = false) {
            if(isadmin == false){
                this.setRoute('veranstalltung', '#Veranstalltung', val);
            }else {
                this.setRoute('veranstalltung', '#admin/veranstalltung', val);
            }
        },

        // Dient zum Laden einer Einzelnden Entiteat wenn das Bearbeitungsicon angeklickt wurde
        /**
         * @param {String} whichEntry
         * @param {mitglied | nachricht} id Das anzuzeigende Objekt
         */
        loadEditEntry(whichEntry, id){
            switch (whichEntry) {
                case 'nachricht':
                    this.nachricht = id;
                    break;
                case 'mitglied':
                    this.mitglied = id;
                    break;
            }
        },

        // bearbeitet die gemachten aenderrungen
        /**
         * Bearbeiten des Jeweiligen Objekts
         *
         *
         * @param {String} type welche Entitaet soll genommen werden
         * @param {Object} id das zu verwendende Objekt
         */
        editEntry(type, id) {
            let url;
            switch (type) {
                case'mitglied':
                    url = 'edit/mitglied';
                    delete id.veranstalltungsIds;
                    delete id.veranstalltung;
                    delete id.betraege;
                    delete id.enabled;
                    clog(JSON.stringify(id));

                    break;
                case 'nachricht':
                    // url = 'edit/'
                    /*
                         Ueberprueft ob der Ersteller geaendert worden ist und jetzt die Richtigen Daten fuer den Spring server
                     */
                    // if(isNaN(this[type].mitglied)){
                    //     clog('unbearbeitet');
                    //     this[type].ersteller = this.url + this.serverurl['mitglied'] + '/' + id;
                    // }else{
                    //     this[type].ersteller = this.url + this.serverurl['mitglied'] + '/' + this[type].mitglied;
                    // }

                    this.nachricht.ersteller = { "id": ""+ this.nachricht.ersteller.id + "" };


                    url = this.serverurl[type] + '/' +  this[type].id;
                    // delete this[type].mitglied;
                    // id = this[this.path['nachricht']];
            }

            this.axiosPut(url, id, true);

        },
        // Loescht komplette Eintraege
        /**
         *
         * @param {String} type genutzte Entitaet
         * @param {String | int} id id des zu loeschenden Objekts
         */
        delEntry(type, id) {
            console.debug('delEntry');

            clog('type');
            clog(type);
            clog('id');
            clog(id);


            let url = 'delete/' + type + '/' + id;

            clog('url');
            clog(url);
            this.axiosDel(url, true)
        },
        //Entfernt einzelnde items zb teilnehmer in Veranstalltung
        /**
         * Entfernt einen Eintrag aus einer Sammlung von Eintraegen (zb Teilnahmen)
         * @param {String} type Objektname
         * @param {Object} data das zu loeschende Objekt
         */
        remEntry(type, data) {
            this.axiospost('rem/' + type, data, true);
        },
        // kuemmert sich um das Einfuehgen von items
        /**
         * Vorbereitung zum erstellen des Neuen Obejkts
         * mit anshliessender Uebergabe an die erstellungsfunktion
         * @param {String} type Objektname
         * @param {Object} data das zu erstellende Objekt
         */
        insertEntry(type, data) {
            let src;
            switch (type) {
                case 'adminmitglied':
                    src = 'mitglied/'+ mitglied.id;
                    this.axiosPut(src, data, true);
                    break;
                case "beitrag":
                    src = 'beitrag';
                    this.beitrag.betrag = this.beitrag.betrag.replace(",",".");

                    clog('beitrag');

                    this.axiospost(src, data, true);

                    break;
                case "leitung":
                    src = 'leitung';
                    break;
                case "mitglied":
                    src = 'sign-up';
                    delete this.user.veranstalltungsIds;
                    this.axiospost(src, data);

                    // data.ort = this.ortDummy;
                    break;
                case "nachricht":
                    this.nachricht.ersteller = { "id": ""+ this.user.id + "" };
                    src = 'nachricht';
                    delete this[type].mitglied;

                    this.axiospost(src, data);

                    break;
                case "raum":
                    src = 'raum';
                    break;
                case "veranstalltungstyp":
                    src = 'veranstalltungstyp';
                    break;
                case "veranstalltung":
                    let datetime = new Date(this.dateformat.date + 'T'+this.dateformat.time+':00.000Z');
                    this.veranstalltung.datum = datetime;

                    if(this.veranstalltung.kosten == "" || this.veranstalltung.kosten == null){
                        this.veranstalltung.kosten = 0;
                    }


                    // Falls kein bestehender Eintrag genommen wurde, dann nimmt er das neuerstellte Objekt
                    if(this.veranstalltung.typ == 0)this.veranstalltung.typ = this.veranstalltungstyp;
                    if(this.veranstalltung.raum == 0)this.veranstalltung.raum = this.raum;
                    if(this.veranstalltung.leitung == 0)this.veranstalltung.leitung = this.leitung;

                    clog(datetime);

                    this.activeVariable = 'veranstalltung';
                    src = 'veranstalltung';

                    clog(JSON.stringify(this.veranstalltung));

                    this.axiospost(src, data);


                    break;
            }

        },
        /**
         * Fuehgt einen Eintrag einer Sammlung hinzu (zb Teilnahmen)
         * @param {String} type Objektname
         * @param {Object} data das hinzuzufuehgende Objekt
         */
        addEntry(type, data) {
            this.axiospost('add/' + type, data,true);
        },

        /**
         * Funktion dient zum Loechen der Daten auf dem Server mit den gegebenen Daten
         * @param {String} url der aufrufphad auf der Serverseite
         * @param {boolean} [reload = false] soll die Seite neugeladen werden
         */
        axiosDel(url, reload = false) {
            let src = this.url + url;
            cbug('axiosDel');
            clog('src');
            clog(src);

            axios.delete(src, this.serverConfig)
                .then(response => {
                    if (reload) {
                        this.reloadSite();
                    }
                    clog(response);
                })
                .catch(error => {
                    this.error = error.response;
                    clog(error.response);
                });
        },

        /**
         * Funktion dient zum aendern der Daten auf dem Server mit den gegebenen Daten
         * @param {String} url der aufrufphad auf der Serverseite
         * @param {Object} data das editierte Objekt
         * @param {boolean} [reload = false] soll die Seite neugeladen werden
         */
        axiosPut(url, data, reload = false) {
            let src = this.url + url;
            clog('put request');
            clog(src);
            clog(JSON.stringify(data));

            axios.put(
                src,
                JSON.stringify(data),
                this.serverConfig
            )
                .then(response => {
                    this.reloadSite(data);
                    if(reload){
                        this.reloadowndata = true;
                    }
                })
                .catch(error => {
                    this.error = error.response;
                    clog(error.response);
                });
        },
        /**
         * Dient zum getaufruf auf den Server um Daten zu erhalten
         * @param {String} url Relative Phad auf dem Server
         * @param {boolean|int} [id = false] id dez zu ladenen items
         */
        axiosget(url, id = false) {
            clog('axiosget');
            let src;
            // erstellt den link zum server
            if(id){
                src = this.url + this.serverurl[url]+'/'+ id;
            }
            else{
                src = this.url + this.serverurl[url];
            }
            // setzt die Actuelle Variable mit dem namen dez zu benutzenden Objekts
            this.activeVariable = this.path[url];

            clog(src);
            clog('src');

            axios.get(src, this.serverConfig)
                .then(response => {

                    clog('speichert ' + url + ' in ' + this.activeVariable);
                    clog('Querrylist: ' + this.querryList);

                    // entfernt unnoetigen prefixe
                    if (JSON.stringify(response.data).toString().includes('{"_embedded":')) {
                        this[this.activeVariable] = response.data._embedded;
                    } else {
                        this[this.activeVariable] = response.data;
                    }

                    clog(JSON.stringify(this[this.activeVariable]));

                    this.activeVariable = null;
                    // abarbeitung der get liste
                    if(this.querryList.length > 0){
                        let item = this.querryList[0];
                        this.querryList.splice(0,1);
                        this.axiosget(item);

                    }else{
                        if(this.reloadowndata){
                            this.reloadowndata = false
                            this.GetMyData();
                        }
                    }

                }).catch(error => {
                    // this.error = error;
                    this.error = "Es ist ein Fehler aufgetreten";
            });
        },

        /**
         * Dient zum postaufruf auf den Server um Daten zu senden
         * @param {String} url Relative Phad auf dem Server
         * @param {Object} data das zu erstellende Objekt
         * @param {boolean} [reload = false] Sollen eigene Daten neugeladen werden
         * */
        axiospost(url, data, reload = false) {
            let src = this.url + url;
            clog('axiospost' + src);
            clog(reload);
            clog(url);
            clog(data);
            clog(JSON.stringify(data));

            axios.post(
                src,
                JSON.stringify(data),
                this.serverConfig
            )
            .then(response => {
                // // loescht eintraege un laedt sich selber neu
                // if(url === 'beitrag'){
                //     this.clearObjects();
                //     this.setRoute('beitraege','#admin/beitraege')
                // }
                if(url === 'sign-up' && this.user.id === "" ){
                    cerr('Registrierung findet statt');
                    this.loginData.username = this.mitglied.username;
                    this.loginData.password = this.mitglied.password;
                    this.login();
                }
                // setzt die einzelnden zu speichernden Obejkte zusammen um die Veranstalltung zu speichern
                if(this.querryList.length > 0){
                    let item = this.querryList[0];
                    this.querryList.splice(0,1);
                    this.axiospost(item, this[item]);
                }else{
                    this.reloadSite(data);
                    if(reload){
                        this.reloadowndata = true;
                    }
                }

                clog('Post erfolgreich')


            })
            .catch(error => {
                if(this.activeVariable === 'veranstalltung'){
                    cerr('Fehler beim veranstalltung');
                    this.reloadSite();
                }
                this.error = error.response;
                clog('error:' + JSON.stringify(error.response));

            });


        },
        /**
         * Dient zum vorbereiten der Getaufrufe
         * @param {String} routewasSollgeladenWerden der Phad der geladen werden soll
         * @param htmlRouten die Bezeichnung zum richtigen Aufrufen der HTML id
         * @param {boolean|int} [id = false] id fuer das zu ladene Item
         */
        // Fungiert als routen manager um die verschiedenen links zu verwalten
        setRoute(routewasSollgeladenWerden, htmlRouten, id = false) {
            this.clearObjects();
            clog('htmlRouten');
            clog(htmlRouten);
            clog(routewasSollgeladenWerden);

            if (routewasSollgeladenWerden === 'logout') {
                this.serverConfig.headers.authorization = null;
                localStorage.removeItem('jwt');
                location.reload();
                // this.clearObjects();
                // this.serverConfig.headers.authorization = null;
                // this.loginData.login = null;
                // this.loginData.passwort = null;

            } else {
                clog('routewasSollgeladenWerden:' + routewasSollgeladenWerden + ' - htmlRouten: ' + htmlRouten);
                switch (htmlRouten) {
                    case '#admin/beitraege':
                        clog('#admin/beitraege');
                        this.querryList.push('mitglieder');
                        this.axiosget(routewasSollgeladenWerden, id);
                        break;
                    case '#admin/veranstalltungen':
                        clog(this.querryList);
                        this.clearObjects();

                        this.querryList.push('raeume','veranstalltungstypen','leitungen');
                        // this.QuerryList.add(raeume,veranstalltungstypen  )
                        clog(this.querryList);
                        this.axiosget(routewasSollgeladenWerden, id);
                        break;
                    case '#admin/nachrichten':
                        this.clearObjects();
                        this.querryList.push('admin/nachrichtersteller');
                        this.axiosget(routewasSollgeladenWerden, id);
                        break;
                    case '#admin/mitglieder':
                        this.clearObjects();
                        this.axiosget(routewasSollgeladenWerden, id);
                        break;
                    case '#admin/mitglied':

                        this.axiosget(routewasSollgeladenWerden, id);
                        break;
                    default:
                        this.axiosget(routewasSollgeladenWerden, id);
                        break;
                }
                this.route = htmlRouten;
            }
        },
        /**
         * Setzt die parameter fuer den post zum Server
         * @param {int} id
         * @param {String} role
         */
        changeMemberRole(id,role){
            clog(id);
            clog(role);
            this.axiospost('admin/changerole/'+id, role.replace("\"",""))

        },
        /**
         * Setzt den Link zum loeschen des Eigenen Bildes
         */

        deleteimage(){
            this.mitglied.bild = null;
            this.axiospost('rem/image', "")
        },
        /**
         * Setzt die parametern fuer den Post zum entfernen des Mitglieds von einer Veranstalltung
         * @param {id} veranstalltungid
         * @param {id} mitglied
         */
        remUserFromEntry(veranstalltungid, mitglied){
            this.axiospost('rem/veranstalltung/'+mitglied, veranstalltungid, true);
        },
        // leert alle vorherigen eintraege und jetzt sie aul start zurueck
        /**
         * Leert die Obejkte
         */
        clearObjects(){
            clog('clearObjects');
            this.error = null;
            this.mitglied = {
                id: '',
                vorname: '',
                nachname: '',
                geaendert: '',
                username: '',
                password: '',
                role: '',
                registriert: null,
                adresse: '',
                hausnummer: '',
                plz: '',
                stadt: '',
            };
            this.nachricht = {
                id: '',
                inhalt: '',
                sichtbarkeit: '',
                titel: '',
                ersteller: null,
                erstellt_am: null,
                mitglied: null,
            };
            this.veranstalltung = {
                id: '',
                beschreibung: '',
                datum: '',
                dauer: '',
                kosten: '',
                name: '',
                teilnehmerzahl: '',
                anzahl: '',
                leitung: '',
                raum: '',
                typ: '',
            };
            this.beitrag= {
                betrag: '',
                einzahler: '',
                datum: '',
                kommentar: '',
            };
            this.dateformat = {
                time: null,
                date:null,
            };
        },
    },
    mounted(){

        // let myStorage = localStorage;
        let jwt = localStorage.getItem('jwt');
        if(jwt !== null){
            this.serverConfig.headers.authorization = jwt;
            this.setRoute('user', '#My');
            clog(jwt);
        }else{
            clog('LOcalstorage wird erstellt');
        }
        clog('Initialisierung');
    },
});