import React, { Component } from 'react';
import { db } from '../firebase';

const MemeListItem = (props) => {
  return(
    <li>
      <img src={props.meme.downloadURL} alt="" />
      <h2>{props.meme.memeName}</h2>
      <h4>{props.meme.upvotes}</h4>
    </li>
  );
}

const MemeList = (props) => {
  const memeItems = props.memes.map((meme) => 
    <MemeListItem key={meme.id} meme={meme}/>
    );
  
    return(
      <ul>{memeItems}</ul>
    );
}

class Explore extends Component {
  constructor(props) {
    super(props);
    this.getDocRefNext = this.getDocRefNext.bind(this);
    this.getDocRefPrevious = this.getDocRefPrevious.bind(this);
    this.getItems = this.getItems.bind(this);

    this.state = {
      itemLimit: 6, // limit how many list items can be fetched at once
      lastDocument: null, // last document copy from the most recent query
      firstDocument: null, // first document copy from the most recent query
      memeArray: [], // the array, which holds the fetched data
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
    if (this.state.lastDocument)
      // return a document reference starting after the last document from the previous query:
      return db.collection('memes').orderBy(orderBy, descAsc)
                .startAfter(this.state.lastDocument).limit(this.state.itemLimit);
    else
      // else return a document reference starting at the beggining of the order by:
      return db.collection('memes').orderBy(orderBy, descAsc).limit(this.state.itemLimit);
  }

  getItems(orderBy, descAsc, previous) {
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

      // initialize a local empty array to store deconstruced documents:
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
      // update the state meme array with the local one:
      this.setState({ memeArray: memeArray });
    });
  }

  componentDidMount() {
    this.getItems('dateCreated', 'desc', false);
  }

  render() {
    return(
      <article className="container">
        {
            this.state.lastDocument && 
            <section>
              <button className="btn btn-dark" type="button" onClick={() => this.getItems('dateCreated', 'desc', true)}>Previous</button>
              <button className="btn btn-dark" type="button" onClick={() => this.getItems('dateCreated', 'desc', false)}>Next</button>
              <MemeList memes={this.state.memeArray} />
            </section>
        }
      </article>
    );
  }
}
export default Explore;