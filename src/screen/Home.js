import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native'
import { wp, hp } from '../constant/constant'
import moment from 'moment';


const Home = () => {
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])
    const [page, setPage] = useState(10)
    const [count, setCount] = useState(1)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const network = async () => {
        const API_KEY = "f469ec4a10aa41d28414c87ae4ceb381"
        const date = moment().format('YYYY-MM-DD')
        try {
            const data = await fetch(`https://newsapi.org/v2/everything?q=Apple&from=${date}&sortBy=popularity&apiKey=${API_KEY}`)
            const json = await data.json()
            setData(json.articles)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        const word = search.toLowerCase().replaceAll(' ', '')
        console.log(word)
        if (word.length > 0) {
            let searchdata = data.filter(item => true === item.title.toLowerCase().includes(`${word}`))
            // console.log(searchdata)
            setData2(searchdata)
            setPage(10)
        }
        else {
            setData2([])
        }
    }

    const handleEnd = () => {
        if(data.length >= page){
            setCount(count + 1)
            setPage(page * count)
        }
        
    }
    useEffect(() => {
        network()
    }, [])

    return (
        <View>
            <View style={styles.header}>
                <View style={styles.title}><Text style={styles.titletext}>News</Text></View>
                <View style={styles.search}>
                    <TextInput onChangeText={item => setSearch(item)} />
                </View>
                <TouchableOpacity style={styles.searchbutton} onPress={() => handleSearch()}><Text>Search</Text></TouchableOpacity>
            </View>
            <FlatList
                data={data2.length > 0 ? data2 : data.slice(0, page)}
                keyExtractor={(item, index) => index}
                renderItem={item => {
                    const data = item.item
                    const date = `${data.publishedAt}`
                    return (
                        <View style={styles.container}>
                            <Image source={{ uri: `${data.urlToImage}` }} style={styles.image} />
                            <View style={styles.subcontainer}>
                                <Text style={styles.subtitle}>{data.title}</Text>
                                <Text numberOfLines={5} style={styles.subdescription}>{data.description}</Text>
                                <Text style={styles.date}>Published on {moment(date).format('MMMM DD YYYY')}</Text>
                            </View>
                        </View>
                    )
                }}
                onEndReached={handleEnd}               
            />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        height: hp('10'),
        // backgroundColor: 'lightgrey',
        paddingHorizontal: wp('2'),
        paddingVertical: hp('1'),
        justifyContent: 'space-between'
    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
        height: hp('8'),
        width: hp('8'),
        borderRadius: 10
    },
    titletext: {
        fontWeight: '700',
        fontSize: hp('2')
    },
    search: {
        borderWidth: 1,
        width: wp('58'),
        borderRadius: 10
    },
    searchbutton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'skyblue',
        height: hp('8'),
        width: hp('8'),
        borderRadius: 10
    },
    container: {
        margin: wp('5'),
        // height: hp('60'),
        borderWidth: 1,
        borderColor: "lightgrey"
    },
    image: {
        width: wp("89.5"),
        height: hp('30'),

    },
    subcontainer: {
        padding: wp('3'),
        backgroundColor: 'lightgrey'
    },
    subtitle: {
        fontSize: hp('2.3'),
        fontWeight: '700'
    },
    subdescription: {
        marginTop: hp('1'),
        fontWeight: 'bold',
        fontSize: hp('1.5')
    },
    date: {
        marginTop: hp('1'),
        fontSize: wp('3')
    }

})

export default Home