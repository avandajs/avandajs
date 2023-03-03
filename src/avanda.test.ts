import { expect, test } from 'vitest'
import Graph from '.'

test('should work as expected', () => {
    let avanda = new Graph()

    let stream = avanda.service("User/name").watch()

    stream.listen((data) => {
      
    })
 
    console.log(avanda)  
  expect(Math.sqrt(4)).toBe(3)


})


