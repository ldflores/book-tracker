import React, { Component } from 'react';
import { Jumbotron, Container, Row, Col, Button, Card, CardBody, CardTitle, CardText, CardImg, Progress, Form, FormGroup, Label, Input, FormText, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faStar, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { fetch } from 'whatwg-fetch';
import './index.css';

class App extends Component {
    constructor(books) {
        super(books);
        this.state = {
            books: [],
            title: "",
            author: "",
            desc: "",
            pages: "",
            read: 0,
            rating: 0,
            dnone: true,
            former: {}
        };
    }
    componentDidMount() {
        fetch('./samplebooks.json')
            .then((res) => res.json())
            .then((data) => {
                this.setState({ books: data })
                console.log(data)
            }).catch((err) => {
                this.setState({ error: err });
            })
    }

    changeValue = (key, value) => {
        this.setState({ [key]: value })
    }

    removeBook = (oldBook) => {
        this.setState(() => {
            let newList = this.state.books.filter((book) => {
                return book !== oldBook;
            });
            return { books: newList};
        });
    }
    
    book = () => {
        this.setState(() => {
            let newBook = [{ title: this.state.title, author: this.state.author, description: this.state.desc, pages: this.state.pages, progress: this.state.read, rating: this.state.rating }];
            let allBooks = this.state.books.filter((book) => {
                return book !== this.state.former;
            });
            return { books: allBooks.concat(newBook) };
        });
    }

    toggleDisplay = (shouldDisplay) => {
        this.setState({ dnone: shouldDisplay });
    }

    reset = () => {
        this.setState(() => {
            return {
                title: "",
                author: "",
                desc: "",
                pages: "",
                read: 0,
                rating: 0
            };
        });
    }

    bookInfo = (book) => {
        this.setState({
            title: book.title,
            author: book.author,
            desc: book.description,
            pages: book.pages,
            read: book.progress,
            rating: book.rating,
            former: book
        });
    }

    handleClick = () => {
        this.toggleDisplay(false);
        this.reset();
    }

    render() {
        if (this.state.error) {
            return (
                <div>
                    <Alert color="danger">
                        {this.state.error.message}
                    </Alert>
                </div>
            );
        } else {
            return (
                <div>
                    <header>
                        <Jumbotron fluid className="py-4">
                            <Container fluid className="text-center">
                                <h1 className="display-3">Book List</h1>
                                <p>Keep a list of books and your reading progress</p>
                            </Container>
                        </Jumbotron>
                    </header>
                    <main>
                        <Container id="edit-book">
                            <Card className="mb-3">
                                <CardBody className={this.state.dnone ? "d-none" : ""}>
                                    <CardTitle className="text-center" id="book-detail" >Book Details</CardTitle>
                                    <BookForm changeValueCallback={this.changeValue} bookState={this.state} newBookCallback={this.book} dNoneCallback={this.toggleDisplay} />
                                </CardBody>
                            </Card>
                        </Container>
                        <Container className="pb-2">
                            <Row>
                                <Col className="text-center mb-2">
                                    <h3>Your Books</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="text-right">
                                    <Button className={!this.state.dnone ? "d-none" : ""} onClick={this.handleClick} aria-label="Add book" ><FontAwesomeIcon icon={faPlus} /> Add book</Button>
                                </Col>
                            </Row>
                        </Container>
                        <Container>
                            <CardList books={this.state.books} setInfoCallback={this.bookInfo} displayFormCallback={this.toggleDisplay} deleteCallback={this.removeBook} />
                        </Container>
                    </main>
                    <footer>
                        <p className="copyright"> &copy;Luis Flores 2020 </p>
                        <cite><a href="https://www.iconfinder.com/icons/1055108/book_booklet_bookmark_icon">Fabicon, </a></cite>
                        <cite><a href="https://www.iconfinder.com/icons/285636/book_icon">Book Icon, </a></cite>
                        <cite><a href="https://unsplash.com/photos/_ar2ENzmqb0">Library Photo, </a></cite>
                        <cite><a href="https://www.lib.washington.edu/">Book Descriptions: University of Washington Libraries</a></cite>
                    </footer>
                </div>
            );
        }
    }
}

class BookForm extends Component {
    handleChange = (event) => {
        let newValue = event.target.value
        this.props.changeValueCallback("title", newValue)
    }

    handleChangeAuthor = (event) => {
        let newValue = event.target.value
        this.props.changeValueCallback("author", newValue)
    }

    handleChangeDesc = (event) => {
        let newValue = event.target.value
        this.props.changeValueCallback("desc", newValue)
    }

    handleChangePages = (event) => {
        let newValue = event.target.value
        this.props.changeValueCallback("pages", newValue)
    }

    handleChangeRead = (event) => {
        let newValue = event.target.value
        this.props.changeValueCallback("read", newValue)
    }

    handleChangeRating = (event) => {
        let newValue = event.target.value
        this.props.changeValueCallback("rating", newValue)
    }

    render() {
        return (
            <Form>
                <FormGroup>
                    <Label htmlFor="title">Title</Label>
                    <Input type="text" id="title" onChange={this.handleChange} value={this.props.bookState.title} />
                    <FormText>* Required</FormText>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="author">Author</Label>
                    <Input type="text" id="author" onChange={this.handleChangeAuthor} value={this.props.bookState.author} />
                    <FormText>* Required</FormText>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="description">Description</Label>
                    <Input type="text" id="description" onChange={this.handleChangeDesc} value={this.props.bookState.desc} />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="pages">Total number of pages</Label>
                    <Input type="number" id="pages" onChange={this.handleChangePages} value={this.props.bookState.pages} />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="progress">How many pages have you read?</Label>
                    <Input type="number" id="progress" onChange={this.handleChangeRead} value={this.props.bookState.read} />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="rating">Choose your rating (0 none, 1 low - 5 high)</Label>
                    <Input type="select" id="rating" onChange={this.handleChangeRating} value={this.props.bookState.rating}>
                        <option>0</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </Input>
                </FormGroup>
                <SaveButton newBookCallback={this.props.newBookCallback} titleLength={this.props.bookState.title.length} authorLength={this.props.bookState.author.length} dNoneCallback={this.props.dNoneCallback} />
                <CancelButton dNone={this.props.bookState.dnone} dNoneCallback={this.props.dNoneCallback} />
            </Form>
        )
    }
}

class SaveButton extends Component {
    handleSaveClick = () => {
        this.props.newBookCallback();
        this.props.dNoneCallback(true);
    }

    render() {
        return (
            <Button type="button" className="mr-1" id="save-button" onClick={this.handleSaveClick} disabled={!(this.props.titleLength > 0) || !(this.props.authorLength > 0)} aria-label="Save" >Save</Button>
        )
    }
}

class CancelButton extends Component {
    handleClick = () => {
        this.props.dNoneCallback(true);
    }

    render() {
        return (
            <Button className="cancel" onClick={this.handleClick} aria-label="Cancel" >Cancel</Button>
        )
    }
}

class CardList extends Component {
    render() {
        let bookCards = this.props.books.map((book) => {
            return (
                <BookCard book={book} setInfoCallback={this.props.setInfoCallback} displayFormCallback={this.props.displayFormCallback} deleteCallback={this.props.deleteCallback} key={book.title} />
            )
        })

        return (
            <Row>
                {bookCards}
            </Row>
        )
    }
}

class BookCard extends Component {
    handleClick = () => {
        this.props.setInfoCallback(this.props.book);
        this.props.displayFormCallback(false);
    }

    handleDeleteClick = () => {
        this.props.deleteCallback(this.props.book);
    }

    render() {
        return (
            <Col md="6" xl="4" className="pb-3 d-flex">
                <Card className="w-100">
                    <CardBody>
                        <CardTitle id="book-title" >{this.props.book.title}</CardTitle>
                        <Row>
                            <Col className="book-img">
                                <CardImg src="img/bookicon.png" alt="A book cover"></CardImg>
                            </Col>
                            <Col>
                                <Row>
                                    <Stars rating={this.props.book.rating} />
                                </Row>
                                <CardText>{this.props.book.author}</CardText>
                                <CardText>{this.props.book.description}</CardText>
                                <CardText>{this.props.book.pages} total pages</CardText>
                                <CardText>Reading Progress:</CardText>
                                <div className="text-center">{this.props.book.progress} out of {this.props.book.pages} pages</div>
                                <Progress value={this.props.book.progress} max={this.props.book.pages} className="mb-3" color="info" role="progressbar" aria-valuenow={this.props.book.progress} aria-valuemin="0" aria-valuemax={this.props.book.pages} ></Progress>
                                <a href="#top" className="btn" onClick={this.handleClick} ><FontAwesomeIcon icon={faEdit} aria-label="Edit" /> Edit</a>
                                <Button onClick={this.handleDeleteClick}><FontAwesomeIcon icon={faTrash} aria-label="Delete" /> Delete</Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}

class Stars extends Component {
    render() {
        let makeStars = (rate) => {
            let stars = [];
            let count = 0;
            while (count < rate) {
                count++;
                stars[stars.length] = <FontAwesomeIcon icon={faStar} key={count} />;
            }
            return stars;
        }
        return (
            <Col className="mb-3">
                {makeStars(this.props.rating)}
            </Col>
        )
    }
}

export default App;
