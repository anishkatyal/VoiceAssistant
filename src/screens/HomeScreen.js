import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Features from '../components/Features';
import { dummyMessages } from '../constants';
import Voice from '@react-native-community/voice';

export default function HomeScreen() {
    const [messages, setMessages] = useState(dummyMessages);
    const [recording, setRecording] = useState(false);
    const [speaking, setSpeaking] = useState(true);

    const clear = () => {
        setMessages([])
    }

    const stopSpeaking = () => {
        setSpeaking(false)
    }

    const speechStartHandler = e => {
        console.log("speech start")
    }
    const speechEndHandler = e => {
        setRecording(false)
        console.log("speech stop")
    }
    const speechResultsHandler = e => {
        console.log("speech result", e)
    }
    const speechErrorHandler = e => {
        console.log("speech error", e)
    }

    const startRecording = async () => {
        console.log("hello")
        setRecording(true)
        try {
            console.log("2")
            await Voice.start('en-GB')
        } catch (error) {
            console.log("3")
            console.log('error:', error)
        }
    }
    const stopRecording = async () => {
        try {
            await Voice.stop()
            setRecording(false)

        } catch (error) {
            console.log('error:', error)
        }
    }
    useEffect(() => {
        Voice.onSpeechStart = speechStartHandler;
        Voice.onSpeechEnd = speechEndHandler;
        Voice.onSpeechResults = speechResultsHandler;
        Voice.onSpeechError = speechErrorHandler;
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        }

    })
    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1 flex mx-5">
                <View className="flex-row justify-center">
                    <Image source={require('../../assets/bot.png')} style={{ width: hp(15), height: hp(15) }} />
                </View>
                {
                    messages.length > 0 ? (
                        <View className="space-y-2 flex-1">
                            <Text className="text-gray-700 font-semibold ml-1">
                                Assistant
                            </Text>
                            <View style={{ height: hp(50) }} className="bg-neutral-200 rounded-3xl p4">
                                <ScrollView bounces={false} className="space-y-4" showsVerticalScrollIndicator={false}>
                                    {
                                        messages.map((message, index) => {
                                            if (message.role === 'assistant') {
                                                if (message.content.includes('https')) {
                                                    //ai image
                                                    return (
                                                        <View key={index} className="flex-row justify-start" style={{ marginRight: 5 }}>
                                                            <View className=" p-2 flex rounded-2xl bg-emerald-100 rounded-tl-none " >
                                                                <Image className="rounded-2xl"
                                                                    source={{ uri: message.content }}
                                                                    style={{ width: wp(60), height: wp(60) }}
                                                                    resizeMode='contain' />
                                                            </View>
                                                        </View>
                                                    )
                                                }
                                                else {
                                                    //text response
                                                    return (
                                                        <View key={index} style={{ width: wp(70), marginLeft: 5 }} className="bg-emerald-100 rounded-xl p-2 rounded-tl-none">
                                                            <Text>{message.content}</Text>

                                                        </View>
                                                    )
                                                }
                                            }
                                            else {
                                                return (
                                                    <View key={index} className="flex-row justify-end" style={{ marginTop: 15, marginRight: 5 }}>
                                                        <View className="bg-white rounded-xl p-2 rounded-tr-none" style={{ width: wp(70) }}>
                                                            <Text>{message.content}</Text>

                                                        </View>
                                                    </View>
                                                )
                                            }
                                        })
                                    }

                                </ScrollView>
                            </View>
                        </View>

                    )
                        : (
                            <Features />
                        )
                }
                <View className="flex justify-center items-center">
                    {recording ? (
                        <TouchableOpacity onPress={stopRecording}>
                            <Image
                                className="rounded-full"
                                style={{ width: hp(10), height: hp(10) }}
                                source={require('../../assets/voiceLoading.gif')}
                            />
                        </TouchableOpacity>
                    )
                        : (
                            <TouchableOpacity onPress={startRecording}>
                                <Image
                                    className="rounded-full"
                                    style={{ width: hp(10), height: hp(10) }}
                                    source={require('../../assets/recordingIcon.png')}
                                />
                            </TouchableOpacity>
                        )
                    }
                    {
                        messages.length > 0 && (
                            <TouchableOpacity onPress={clear} className="bg-neutral-400 rounded-3xl p-2 absolute right-10">
                                <Text className="text-white font-semibold">Clear</Text>
                            </TouchableOpacity>
                        )
                    }
                    {
                        speaking && (
                            <TouchableOpacity onPress={stopSpeaking} className="bg-red-400 rounded-3xl p-2 absolute left-10">
                                <Text className="text-white font-semibold">Stop</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </SafeAreaView>
        </View>
    )
}


