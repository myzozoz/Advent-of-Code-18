#include <iostream>
#include <fstream>
#include <cstdlib>
#include <string>

using namespace std;

int* fileParser();

int main () {
  int* integers = fileParser();

  int sum = 0;
  for (int i = 0; i < 1000; i++) {
    sum += integers[i];
  }
  cout << sum << "\n";
  return 0;
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