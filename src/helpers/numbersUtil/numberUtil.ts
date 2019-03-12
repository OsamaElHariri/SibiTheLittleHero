export class NumbersUtil {
    static mod(n: number, m: number) {
        return ((n % m) + m) % m;
    }
}