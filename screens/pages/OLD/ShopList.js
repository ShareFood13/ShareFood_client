import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Constants from 'expo-constants';
import { useState } from 'react';
import products from '../../../assets/arrays/data'



const myRecipes = [
    {
        _id: '123',
        ingredients: [
            {
                product: 'tomato',
                quantity: 5,
                units: 'units',
                remark: 'text',
                _id: 'aaa',
            },
            {
                product: 'flour',
                quantity: 1,
                units: 'Cup',
                remark: 'text',
                _id: 'aaa',
            },
            {
                product: 'milk',
                quantity: 2,
                units: 'Liter',
                remark: 'text',
                _id: 'aaa',
            },
            {
                product: 'meat',
                quantity: 3,
                units: 'KiloGrams',
                remark: 'text',
                _id: 'aaa',
            },
            {
                product: 'onions',
                quantity: 1,
                units: 'units',
                remark: 'text',
                _id: 'aab',
            },
            {
                product: 'olives',
                quantity: 20,
                units: 'units',
                remark: 'text',
                _id: 'aar',
            },
        ],
    },
    {
        _id: '124',
        ingredients: [
            {
                product: 'cumcumber',
                quantity: 2,
                units: 'units',
                remark: 'text',
                _id: 'aa4',
            },
            {
                product: 'chives',
                quantity: 1,
                units: 'units',
                remark: 'text',
                _id: 'aaa5',
            },
            {
                product: 'salt',
                quantity: 3,
                units: 'TeaSpoon',
                remark: 'text',
                _id: 'aaa5r',
            },
            {
                product: 'black pepper',
                quantity: 1,
                units: 'TeaSpoon',
                remark: 'text',
                _id: 'aaa5y',
            },
        ],
    },
    {
        _id: '124',
        ingredients: [
            {
                product: 'tomato',
                quantity: 400,
                units: 'Grams',
                remark: 'text',
                _id: 'aa4',
            },
            {
                product: 'chives',
                quantity: 1,
                units: 'units',
                remark: 'text',
                _id: 'aaa5',
            },
            {
                product: 'water',
                quantity: 2,
                units: 'Pint',
                remark: 'text',
                _id: 'aaa5',
            },
            {
                product: 'Soup',
                quantity: 2,
                units: 'Gallon',
                remark: 'text',
                _id: 'aaa5',
            },
            {
                product: 'cumcumber',
                quantity: 5,
                units: 'units',
                remark: 'text',
                _id: 'aaa5r',
            },
            {
                product: 'garlic',
                quantity: 5,
                units: 'TableSpoon',
                remark: 'text',
                _id: 'aaa5r',
            },
            {
                product: 'garlic',
                quantity: 5,
                units: 'units',
                remark: 'text',
                _id: 'aaa5r',
            },
            {
                product: 'pepper',
                quantity: 3,
                units: 'Pint',
                remark: 'text',
                _id: 'aaa5y',
            },
        ],
    },
];

const mass = [
    // { system: "metric", unit: "From...To...", abreviation: "", toGrams: 0, toKiloGrams: 0, toOnces: 0, toPounds: 0 },
    {
        system: 'metric',
        unit: 'Grams',
        abreviation: 'g',
        toGrams: 1,
        toKiloGrams: 0.001,
        toOnces: 0.0352739619,
        toPounds: 0.00220462262,
    },
    {
        system: 'metric',
        unit: 'KiloGrams',
        abreviation: 'Kg',
        toGrams: 1000,
        toKiloGrams: 1,
        toOnces: 35.2739619,
        toPounds: 2.20462262,
    },
    {
        system: 'imperial',
        unit: 'Onces',
        abreviation: 'Oz',
        toGrams: 28.3495231,
        toKiloGrams: 0.0283495231,
        toOnces: 1,
        toPounds: 0.0625,
    },
    {
        system: 'imperial',
        unit: 'Pounds',
        abreviation: 'lbs',
        toGrams: 453.59237,
        toKiloGrams: 0.45359237,
        toOnces: 16,
        toPounds: 1,
    },
    {
        system: 'both',
        unit: 'TeaSpoon',
        abreviation: 'tsp',
        toGrams: 5,
        toKiloGrams: 0.005,
        toTableSpoon: 0.3333,
        toCup: 0.02,
        toOnces: 0.16,
    },
    {
        system: 'both',
        unit: 'TableSpoon',
        abreviation: 'tbs',
        toGrams: 15,
        toKiloGrams: 0.015,
        toTeaSpoon: 3,
        toCup: 0.0625,
        toOnces: 0.5,
    },
    {
        system: 'both',
        unit: 'Cup',
        abreviation: 'cup',
        toGrams: 236.58,
        toKiloGrams: 0.23,
        toTeaSpoon: 48,
        toTableSpoon: 16,
        toOnces: 8,
    },
];

const volume = [
    // { system: "metric", unit: "From...To...", abreviation: "", toMilliLiter: 0, toLiter: 0, toTeaSpoon: 0, toTableSpoon: 0, toCup: 0, toOnces: 0, toPint: 0, toGallon: 0 },
    {
        system: 'metric',
        unit: 'MilliLiter',
        abreviation: 'ml',
        toMilliLiter: 1,
        toLiter: 0.001,
        toTeaSpoon: 0.2,
        toTableSpoon: 0.067,
        toCup: 0.0042,
        toOnces: 0.033,
        toPint: 0.0021,
        toGallon: 0.00026,
    },
    {
        system: 'metric',
        unit: 'Liter',
        abreviation: 'L',
        toMilliLiter: 1000,
        toLiter: 1,
        toTeaSpoon: 202.88,
        toTableSpoon: 67.62,
        toCup: 4.227,
        toOnces: 33.814,
        toPint: 2.11,
        toGallon: 0.26,
    },
    {
        system: 'both',
        unit: 'TeaSpoon',
        abreviation: 'tsp',
        toMilliLiter: 5,
        toLiter: 0.005,
        toTeaSpoon: 1,
        toTableSpoon: 0.3333,
        toCup: 0.02,
        toOnces: 0.16,
        toPint: 0.01,
        toGallon: 0.0013,
    },
    {
        system: 'both',
        unit: 'TableSpoon',
        abreviation: 'tbs',
        toMilliLiter: 15,
        toLiter: 0.015,
        toTeaSpoon: 3,
        toTableSpoon: 1,
        toCup: 0.0625,
        toOnces: 0.5,
        toPint: 0.031,
        toGallon: 0.0039,
    },
    {
        system: 'both',
        unit: 'Cup',
        abreviation: 'cup',
        toMilliLiter: 236.58,
        toLiter: 0.23,
        toTeaSpoon: 48,
        toTableSpoon: 16,
        toCup: 1,
        toOnces: 8,
        toPint: 0.5,
        toGallon: 0.062,
    },
    {
        system: 'imperial',
        unit: 'Onces',
        abreviation: 'oz',
        toMilliLiter: 29.57,
        toLiter: 0.029,
        toTeaSpoon: 6,
        toTableSpoon: 2,
        toCup: 0.12,
        toOnces: 1,
        toPint: 0.062,
        toGallon: 0.0077,
    },
    {
        system: 'imperial',
        unit: 'Pint',
        abreviation: 'pnt',
        toMilliLiter: 473.17,
        toLiter: 0.46,
        toTeaSpoon: 96,
        toTableSpoon: 32,
        toCup: 2,
        toOnces: 16,
        toPint: 1,
        toGallon: 0.12,
    },
    {
        system: 'imperial',
        unit: 'Gallon',
        abreviation: 'gal',
        toMilliLiter: 3785.41,
        toLiter: 3.74,
        toTeaSpoon: 768,
        toTableSpoon: 256,
        toCup: 16,
        toOnces: 128,
        toPint: 8,
        toGallon: 1,
    },
];
export default function App() {
    const [system, setSystem] = useState('metric');
    //aqui eu recebi um [] com todos os ingredientes
    const newMyRecipes = [];
    myRecipes.map((myRecipe) => {
        myRecipe.ingredients.map((ingredient) => newMyRecipes.push(ingredient));
    });

    if (system === 'metric') {
        newMyRecipes.map((item) =>
            item.units === 'units'
                ? products.map((prod) => {
                    if (prod.product === item.product) {
                        item.quantity = item.quantity * prod.metricQty;
                        item.units = prod.metricUn;
                    }
                })
                : null
        );
        newMyRecipes.map((item) =>
            mass.map((value) => {
                if (item.units === value.unit) {
                    item.quantity = item.quantity * value.toGrams;
                    item.units = 'Grams';
                }
            })
        );
        newMyRecipes.map((item) =>
            volume.map((value) => {
                if (item.units === value.unit) {
                    item.quantity = item.quantity * value.toMilliLiter;
                    item.units = 'MilliLiters';
                }
            })
        );
    } else {
        newMyRecipes.map((item) =>
            item.units === 'units'
                ? products.map((prod) => {
                    if (prod.product === item.product) {
                        item.quantity = item.quantity * prod.imperialQty;
                        item.units = prod.imperialUn;
                    }
                })
                : null
        );
        newMyRecipes.map((item) =>
            mass.map((value) => {
                if (item.units === value.unit) {
                    item.quantity = item.quantity * value.toOnces;
                    item.units = 'Onces';
                }
            })
        );
        newMyRecipes.map((item) =>
            volume.map((value) => {
                if (item.units === value.unit) {
                    item.quantity = item.quantity * value.toOnces;
                    item.units = 'Onces';
                }
            })
        );
    }

    const newArray = newMyRecipes.reduce((acc, item) => {
        // check if item with the same product exists in the accumulator
        const existingItem = acc.find(
            (i) => i.product === item.product && i.units === item.units
        );
        if (existingItem) {
            // if it does, add the quantities together
            existingItem.quantity += item.quantity;
        } else {
            // if it doesn't, add the new item to the accumulator
            acc.push(item);
        }
        return acc;
    }, []);

    return (
        <View style={styles.container}>
            {newArray.map((item) => (
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ width: 120 }}>Prod: {item.product} </Text>
                    <Text style={{ width: 90 }}>Qty: {item.quantity} </Text>
                    <Text>Un: {item.units} </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
});
