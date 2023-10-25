import axios from "axios";
import * as M from "materialize-css";
import Vue from "vue";

class document  {
    documents:Array<document> = new Array<document>
    DocumentName: string = "" 
    DocumentCode: string = ""
    DocumentType: string = ""
    DocumentNumber: string = ""
    RiskLevel: string = ""
    isLoading : boolean =  true
    selectedDocument : string = ""
    selectedDocumentId: number = 0
}

// tslint:disable-next-line no-unused-expression
var vm = new Vue( { //eslint-disable-next-line no-new
    computed: {
        hazDocuments() : boolean{
            return this.isLoading === false && this.documents.length>0;
        },
        noDocuments() : boolean{
            return this.isLoading === false && this.documents.length === 0;
        }
    },
    data: {
        documents: [],
        DocumentName: "",
        DocumentCode: "",
        DocumentType: "",
        DocumentNumber: "",
        RiskLevel: "",
        isLoading : true,
        selectedDocument : "",
        selectedDocumentId: 0

    },
    el:"#app",
    methods:{
        addDocument : function () {
            const document = {
                DocumentName: this.DocumentName,
                DocumentCode: this.DocumentCode,
                DocumentType: this.DocumentType,
                DocumentNumber: this.DocumentNumber,
                RiskLevel: this.RiskLevel
            };
            axios
                .post("/api/documents/add", document)
                .then( ()=> {
                    this.$refs.year.focus();
                    this.DocumentName = "";
                    this.DocumentCode = "";
                    this.DocumentNumber = "";
                    this.DocumentType = "";
                    this.RiskLevel = "";
                    this.loadDocuments();
                } )
                .catch((err:any) =>{
                    //tsLint:disable-next-line:no-console
                    console.log(err);
                });
        },
        confirmDeleteDocument: function (id : string) {                 
                const document = this.documents.find((d:any)=> d.id === id);
                this.selectedDocument = `${DocumentName}`;
                this.selectedDocumentId = document.id;
                const dc = this.$refs.deleteConfirm;
                const modal = M.Modal.init(dc);
                modal.open();
        },
        deleteDocument : function (id : string){
            axios
                .delete(`/api/documents/remove/${id}`)
                .then(this.loadDocuments)
                .catch((err:any) =>{
                    //tslint: disable-next-line:no-console
                    console.log(err);
                });
        },
        loadDocuments: function() {
            axios
                .get('/api/documents/all')
                .then((res :any) => {
                    this.isLoading = false;
                    vm.$data.documents = res.data;
                })
                .catch((err) =>{
                    // tslint:disable-next-line:no-console
                    console.log( err );
                });
        }
    },
    mounted : function () {
        return this.loadDocuments(); 
    }
} );

