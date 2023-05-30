# fakestoreapi
Dear,

I’ve completed performance test on frequently used API for test App https://fakestoreapi.com.

Test executed for the below mentioned scenario in server https://fakestoreapi.com.

10 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 4.8 And Total Concurrent API requested: 290.

50 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 24 And Total Concurrent API requested: 1450.

100 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 48 And Total Concurrent API requested: 2900.

150 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 49 And Total Concurrent API requested: 4350

200 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 57 And Total Concurrent API requested: 5800

300 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 101 And Total Concurrent API requested: 8700

340 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 88 And Total Concurrent API requested: 9860

While executed 340 concurrent request, found 1 request got connection timeout and error rate is 0.32%.
Summary: Server can handle almost concurrent 8700 API call with almost zero (0) error rate.

Report :
![Screenshot (331)](https://github.com/Swarna2509/Jmeter_bookingapi/assets/72212832/bf8942db-9b9c-425f-b272-41635c861bd2)
![Screenshot (332)](https://github.com/Swarna2509/Jmeter_bookingapi/assets/72212832/a4050c9e-c713-468d-9701-0aeb5ed4eb8c)
![Screenshot (333)](https://github.com/Swarna2509/Jmeter_bookingapi/assets/72212832/e003f812-0780-46b7-a457-8a1e1f861304)

