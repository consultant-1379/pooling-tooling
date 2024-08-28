package common_classes

class ExternalParameters {

    static List numberOfUser(String defaultValue='50') {
        return ['NUMBER_OF_USER', defaultValue, 'Number of incoming virtual users.']
    }

    static List duration(String defaultValue='5m') {
        return ['DURATION', defaultValue, 'Duration of the test. Eg. 10s [seconds], 10m [minutes]']
    }

}
