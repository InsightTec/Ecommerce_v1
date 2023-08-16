const mongoose = require("mongoose");
class apiFamilyFilter {
    constructor(filterPipeLine,familyFilterCommand, type='family') {
      this.filterPipeLine = filterPipeLine;
      this.familyFilterCommand = familyFilterCommand;
      this.type = type;
    }
  
    IDp() {
      if(this.familyFilterCommand.hasOwnProperty('IDp'))
      {
        //console.log('this.familyFilterCommand.IDp'+this.familyFilterCommand.IDp)
        
        this.filterPipeLine.push({ $match: { IDp:  this.familyFilterCommand.IDp.IDp==='YES'?true:false }})
      }
      return this;
    }
    dateOfIDp() {
      if(this.familyFilterCommand.hasOwnProperty('IDp'))
      if(this.familyFilterCommand.IDp.IDp==='YES')
      {
          if(this.familyFilterCommand.IDp.hasOwnProperty('dateOfIDp'))
            {
              this.filterPipeLine.push({ $match: { dateOfIDp:  { [this.familyFilterCommand.IDp.dateOfIDp.operator] : new Date(this.familyFilterCommand.IDp.dateOfIDp.value) } }})
            }
      }
    
      return this;
    }
    individuals() {
      if(this.familyFilterCommand.hasOwnProperty('individuals'))
      {
         let individua=["640e0413393f3481c2f56370","640e0413393f3481c2f56372","640e0413393f3481c2f56381","640e0413393f3481c2f5638d"] ;
        
         individua = individua.map((el) => mongoose.Types.ObjectId(el) );
         this.filterPipeLine.push( { $match : { individuals: { "$in": individua } } });
      }
      return this;
    }

    originalPlaceGovernorate() {
      if(this.familyFilterCommand.hasOwnProperty('originalPlace'))
      {
         let originalPlaceIds=this.familyFilterCommand.originalPlace.hand;
        
         originalPlaceIds = originalPlaceIds.map((el) => mongoose.Types.ObjectId(el) );
         this.filterPipeLine.push( { $match : { 'originalPlace.hand': { "$in": originalPlaceIds } } });
      }
      return this;
    }
    originalPlaceHand() {
      if(this.familyFilterCommand.hasOwnProperty('originalPlace'))
      if(this.familyFilterCommand.originalPlace.originalPlace==='YES')
      {
         let originalPlaceIds=this.familyFilterCommand.originalPlace.hand;
        if(originalPlaceIds.length>0 && originalPlaceIds[0]!='')
        {
          console.log('originalPlaceIds='+originalPlaceIds)
             originalPlaceIds = originalPlaceIds.map((el) => mongoose.Types.ObjectId(el) );
         this.filterPipeLine.push( { $match : { 'originalPlace.hand': { "$in": originalPlaceIds } } });
        }
      
      }
      return this;
    }
    currentPlaceHand() {
      if(this.familyFilterCommand.hasOwnProperty('currentPlace.hand'))
    {
        let currentPlaceIds=this.familyFilterCommand.currentPlace.hand;
        if(currentPlaceIds.length>0 && currentPlaceIds[0]!='')
        {
           currentPlaceIds = currentPlaceIds.map((el) => mongoose.Types.ObjectId(el) );
        this.filterPipeLine.push( { $match : { 'currentPlace.hand': { "$in": currentPlaceIds } } });
        }
       
    }
      return this;
    }
    currentPlaceHouseType() {
      if(this.familyFilterCommand.hasOwnProperty('currentPlace.house.type'))
      {
          let houseTypeIds=this.familyFilterCommand.currentPlace.house.type;
        
          houseTypeIds = houseTypeIds.map((el) => mongoose.Types.ObjectId(el) );
          this.filterPipeLine.push( { $match : { 'currentPlace.house.type': { "$in": houseTypeIds } } });
      }
      return this;
    }
    currentPlaceHouseIsOwner() {
      if(this.familyFilterCommand.hasOwnProperty('currentPlace.house.isOwner'))
      {
          let houseIsOwner=this.familyFilterCommand.currentPlace.house.isOwner;
          this.filterPipeLine.push( { $match: { 'currentPlace.house.isOwner':  houseIsOwner }});
      }
      return this;
    }
    campName() {
      if(this.familyFilterCommand.hasOwnProperty('camp.name'))
    {
        let campNameIds=this.familyFilterCommand.camp.name;
      
        campNameIds = campNameIds.map((el) => mongoose.Types.ObjectId(el) );
        this.filterPipeLine.push( { $match : { 'camp.name': { "$in": campNameIds } } });
    }
      return this;
    }
    campHouse() {
      if(this.familyFilterCommand.hasOwnProperty('camp.house'))
      {
          let campHouseIds=this.familyFilterCommand.camp.house;
        
          campHouseIds = campHouseIds.map((el) => mongoose.Types.ObjectId(el) );
          this.filterPipeLine.push( { $match : { 'camp.house': { "$in": campHouseIds } } });
      }
      return this;
    }
    hasDisease() {
      
      return this;
    }
    diseases() {
      
      return this;
    }
    hasDisability() {
      
      return this;
    }
    disabilities() {
      
      return this;
    }
    paginate(documentsCounts){

      return this;
    }
    search(){
      
      return this;
    }
    limitFields(){
      return this;
    }
    sort(){
      return this;
    }
  
  
  }
  
  module.exports = apiFamilyFilter;
  