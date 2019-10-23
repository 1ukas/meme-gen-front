import React, { Component } from 'react';
import { db } from '../firebase';
import { DH_CHECK_P_NOT_PRIME } from 'constants';

const MemeListItem = (props) => {
  return(
    // <div className="showcase-container border border-danger rounded col-11 col-lg-4 my-2 justify-content-center">
    //   <div className="">
    //     <div className="showcase-image row">
    //       <h4 className="col-1 my-auto">{props.meme.upvotes}</h4>
    //       <img className="col-11 img-fluid rounded float-right d-block" src={props.meme.downloadURL} alt="" />
    //       {/* <span className="badge badge-primary badge-pill">{props.meme.upvotes}</span> */}
    //     </div>
    //     <div className="row">
    //       <h4 className="col-12">{props.meme.memeName}</h4>
    //     </div>
    //   </div>
    // </div>
    <div className="card showcase-image border-secondary col-11 col-lg-3 mx-2 my-2">
      <img className="card-img-top" src={props.meme.downloadURL} alt=""/>
      <div className="card-body showcase-container">
        <h5 className="card-title">{props.meme.memeName}</h5>
        <p className="card-text">{props.meme.upvotes}</p>
      </div>
    </div> 
  );
}

const MemeList = (props) => {
  const memeItems = props.memes.map((meme) => 
    <MemeListItem key={meme.id} meme={meme}/>
    );
  
    return(
      // <div className="row justify-content-center text-center mx-auto">{memeItems}</div>
      <div className="row justify-content-center text-center no-gutters">{memeItems}</div>
    );
}

class Explore extends Component {
  constructor(props) {
    super(props);
    this.getDocRefNext = this.getDocRefNext.bind(this);
    this.getDocRefPrevious = this.getDocRefPrevious.bind(this);
    this.getItems = this.getItems.bind(this);
    this.getPageNumber = this.getPageNumber.bind(this);
    this.getItemsOld = this.getItemsOld.bind(this);
    this.getItemsMaybeThisTime = this.getItemsMaybeThisTime.bind(this);
    this.getPageNumberMaybe = this.getPageNumberMaybe.bind(this);


    this.state = {
      itemLimit: 6, // limit how many list items can be fetched at once
      lastDocument: null, // last document copy from the most recent query
      firstDocument: null, // first document copy from the most recent query
      memeArray: [], // the array, which holds the fetched data
      pageNumber: 0, // the page we're currently on
      pageDataDictionary: {}, // all of the fetched data in a 'pageNumber: pageData' dictionary
      pageDocDictionary: {},
      loaded: false, // is the page loaded with the data
    }
  }

  getDocRefPrevious(orderBy, descAsc) {
    // if we saved the first document from the previous query:
    if (this.state.firstDocument) {
      // to get the previous document collection we have to reverse our query:
      if (descAsc === 'desc')
        // if sorting is by descending - sort by ascending instead
        // and start after the first document from the previous query:
        return db.collection('memes').orderBy(orderBy, 'asc')
                  .startAfter(this.state.firstDocument).limit(this.state.itemLimit);
      else
        // else if sorting by ascending - sort by descending instead
        // and start after first document from the previous query:
        return db.collection('memes').orderBy(orderBy, 'desc')
                  .startAfter(this.state.firstDocument).limit(this.state.itemLimit);
    }
  }

  getDocRefNext(orderBy, descAsc) {
    // if we saved the last document from the previous query:
    if (this.state.pageDocDictionary[this.state.pageNumber])
      // return a document reference starting after the last document from the previous query:
      return db.collection('memes').orderBy(orderBy, descAsc)
                .startAfter(this.state.pageDocDictionary[this.state.pageNumber].lastDocument)
                .limit(this.state.itemLimit);
    else
      // else return a document reference starting at the beggining of the order by:
      return db.collection('memes').orderBy(orderBy, descAsc).limit(this.state.itemLimit);
  }

  getItemsOld(orderBy, descAsc, previous) {
    // get the document reference:
    const docRef = previous ? this.getDocRefPrevious(orderBy, descAsc) 
                            : this.getDocRefNext(orderBy, descAsc);
    // if nothing returned to docRef - exit:
    if (!docRef) return;

    // get the documents from Firestore:
    docRef.get().then((snapshot) => {
      // if we're at the end of the collection - exit:
      if (snapshot.docs.length <= 0) return;

      // save the first and last document (reversed when going back) for pagination:
      const firstDocument = snapshot.docs[0];
      const lastDocument = snapshot.docs[snapshot.docs.length-1];
      this.setState({
        lastDocument: previous ? firstDocument : lastDocument,
        firstDocument: previous ? lastDocument : firstDocument,
        memeArray: [] // reset meme array
      });

      // initialize a local empty array to store deconstructed documents:
      let memeArray = [];
      // loop over every document:
      snapshot.forEach((doc) => {
        // deconstruct document:
        const memeData = {
          downloadURL: doc.data().downloadURL,
          memeName: doc.data().memeName,
          dateCreated: doc.data().dateCreated,
          upvotes: doc.data().upvotes,
          id: doc.id
        }
        // push to local memeArray:
        memeArray.push(memeData);
      });

      // reverse the local meme array when going to the previous page
      // because we get the data in reversed order:
      if (previous) memeArray.reverse();

      // console.log(this.state.pageDataDictionary);
      this.setState({ loaded: true });

      // update the state meme array with the local one:
      this.setState({ memeArray: memeArray });
    });
  }

  /* 
    Make pagination going forward get the latest data.
    Make it get cached data when going backwards.
  */

  getPageNumber(previous) {
    // if going backwards and we already have data for that page:
    if (previous && this.state.pageDataDictionary[this.state.pageNumber-1]) {
      // set the page number to it:
      this.setState(prevState => ({
        pageNumber: prevState.pageNumber-1
      }));
      return false;
    }
    else if (!previous && this.state.pageDataDictionary[this.state.pageNumber+1]
            && this.state.pageDataDictionary[this.state.pageNumber+1].length 
            === this.state.itemLimit) {
      this.setState(prevState => ({
        pageNumber: prevState.pageNumber+1
      }));
      return false;
    }
    else {
      // return true if no page data is saved:
      return true;
    }
  }

  getPageNumberMaybe(previous) {
    // if going backwards and we already have data for that page:
    if (previous && this.state.pageDataDictionary[this.state.pageNumber-1]) {
      // set new page number:
      const pageNumber = this.state.pageNumber-1;
      this.setState({ pageNumber: pageNumber });
      return false;
    }
    else {
      // return true if no page data is saved:
      return true;
    }
  }

  getItemsMaybeThisTime(orderBy, descAsc, previous) {
    console.log('pN before: '+this.state.pageNumber);
    if (previous && this.state.pageNumber <= 1) return console.log('trying to go below page 1');

    if (!this.getPageNumberMaybe(previous)) return console.log('data already in cache');

    // get the document reference:
    const docRef = this.getDocRefNext(orderBy, descAsc);
    // if nothing returned to docRef - exit:
    if (!docRef) return console.log('no doc ref');

    // get the documents from Firestore:
    docRef.get().then((snapshot) => {
      // if we're at the end of the collection - exit:
      if (snapshot.docs.length <= 0) return console.log('doc length 0 or below');
      // set loaded to false to indicate loading:
      this.setState({ loaded: false });

      // initialize a local empty array to store deconstructed documents:
      let dataArray = [];
      // loop over every document:
      snapshot.forEach((doc) => {
        // deconstruct document:
        const docData = {
          downloadURL: doc.data().downloadURL,
          memeName: doc.data().memeName,
          dateCreated: doc.data().dateCreated,
          upvotes: doc.data().upvotes,
          id: doc.id
        }
        // push to local memeArray:
        dataArray.push(docData);
      });

      // save the first and last document for pagination:
      const firstLastDoc = {
        firstDocument: snapshot.docs[0],
        lastDocument: snapshot.docs[snapshot.docs.length-1]
      }

      // calc new page number:
      const pageNumber = this.state.pageNumber+1;
      // push fetched document data to the end of the state data dictionary:
      // push first and last document to the end of the state document dictionary:
      this.setState(prevState => ({
        pageDataDictionary: {
          ...prevState.pageDataDictionary, [pageNumber]: dataArray
        },
        pageDocDictionary: {
          ...prevState.pageDocDictionary, [pageNumber]: firstLastDoc
        },
        pageNumber: pageNumber
      }));

      // set loaded to true to indicate finished loading:
      this.setState({ loaded: true });
      console.log('pN after: '+this.state.pageNumber);
    });
  }

  getItems(orderBy, descAsc, previous) {
    // exit if going back and already on the first page:
    if (previous && this.state.pageNumber === 0) return;

    if (!this.getPageNumber(previous)) return;
    
    // // get the document reference:
    const docRef = this.getDocRefNext(orderBy, descAsc);
    // if nothing returned to docRef - exit:
    if (!docRef) return;

    // get the documents from Firestore:
    docRef.get().then((snapshot) => {
      // if we're at the end of the collection - exit:
      if (snapshot.docs.length <= 0) return;

      // save the first and last document (reversed when going back) for pagination:
      const firstDocument = snapshot.docs[0];
      const lastDocument = snapshot.docs[snapshot.docs.length-1];
      this.setState({
        lastDocument: lastDocument,
        firstDocument: firstDocument,
      });

      // initialize a local empty array to store deconstructed documents:
      let memeArray = [];
      // loop over every document:
      snapshot.forEach((doc) => {
        // deconstruct document:
        const memeData = {
          downloadURL: doc.data().downloadURL,
          memeName: doc.data().memeName,
          dateCreated: doc.data().dateCreated,
          upvotes: doc.data().upvotes,
          id: doc.id
        }
        // push to local memeArray:
        memeArray.push(memeData);
      });

      this.setState(prevState => ({
        pageDataDictionary: {
          ...prevState.pageDataDictionary, [prevState.pageNumber+1]: memeArray
        },
        pageNumber: prevState.pageNumber+1
      }));

      // set page loaded to true:
      this.setState({ loaded: true });
    });
  }

  componentDidMount() {
    this.getItemsMaybeThisTime('dateCreated', 'desc', false);
  }

  render() {
    return(
      <article className="container-fluid">
        {
            this.state.loaded && 
            <>
            <section className="row justify-content-center text-center">
              <div className="col-11 col-lg-11">
                <button className="btn btn-dark" type="button" onClick={() => this.getItemsMaybeThisTime('dateCreated', 'desc', true)}>Previous</button>
                <button className="btn btn-dark" type="button" onClick={() => this.getItemsMaybeThisTime('dateCreated', 'desc', false)}>Next</button>
              </div>
            </section>

            <MemeList memes={this.state.pageDataDictionary[this.state.pageNumber]} />

            {/* <section className="row justify-content-center text-center">
              <div className="col-11 col-lg-11">
                <MemeList memes={this.state.pageDataDictionary[this.state.pageNumber]} />
              </div>
            </section> */}
            </>
        }
      </article>
    );
  }
}
export default Explore;