#include <iostream>
#include <fstream>
#include <cstdlib>
#include <string>

using namespace std;

int* fileParser();
bool contains(int* frequencies, int num, int size);

int main () {
  int* integers = fileParser();
  //make this one big just to be sure
  int* frequencies = new int[1000000];

  int frequency = 0;
  frequencies[0] = 0;
  for (int i = 0; ;i++) {
    cout << "iteration " << i << "\n";
    int a = i % 1000;
    frequency += integers[a];

    cout << "Searching for " << frequency << "\n";
    if (integers[a] != 0 && contains(frequencies, frequency, i+1)){
      break;
    }
  }
  cout << frequency << "\n";
  return 0;
}

bool contains(int* frequencies, int num, int size) {
  bool contained = false;
  for(int i = 0; i < size; i++) {
    if (frequencies[i] == num) {
      contained = true;
      break;
    }
  }
  if (!contained) {
    frequencies[size] = num;
  }

  return contained;
}


int* fileParser() {
  //open the stream
  ifstream inf("input.txt");

  //exit if the stream doesn't work
  if (!inf) {
    cerr << "Could not read file\n";
    exit(1);
  }

  //We know the file is 1000 characters long, so let's put in some extra space
  int* ia = new int[10000];
  int iterator = 0;
  while (inf) {
    string strInput;
    getline(inf, strInput);
    //Remove plus signs
    if (strInput[0] == '+') {
      strInput.erase(0, 1);
    }
    if (strInput.length() > 0)
    ia[iterator] = stoi(strInput);
    iterator++;
  }
  //We know there's no number 0 character in the input file
  ia[iterator] = 0;
  return ia;
}